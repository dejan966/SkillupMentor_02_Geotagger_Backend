import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { Repository } from 'typeorm';
import { compareHash, hash } from 'utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetTokensService } from 'modules/password_reset_tokens/password_reset_tokens.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly password_reset_tokens_service: PasswordResetTokensService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {
    super(usersRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email });
    if (user) {
      throw new BadRequestException('User with that email already exists.');
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto });
      return this.usersRepository.save(newUser);
    } catch (error) {
      Logging.error(error);
      throw new BadRequestException(
        'Something went wrong while creating a new user.',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { avatar, password, confirm_password, ...rest } = updateUserDto;
    const user = await this.findById(id);
    try {
      for (const key in user) {
        if (rest[key]) user[key] = rest[key];
      }
      return this.usersRepository.save(user);
    } catch (error) {
      Logging.log(error);
      throw new NotFoundException(
        'Something went wrong while updating the data.',
      );
    }
  }

  async checkEmail(userEmail: string) {
    const user = await this.findBy({ email: userEmail });
    if(user){
      return this.sendEmail(user)
    }
  }

  async sendEmail(user:User){
    const token = Math.random().toString(36).slice(2, 12);
    const currDate = new Date();
    const token_expiry_date = new Date(currDate.getTime() + 15 * 60000).toString();
    await this.password_reset_tokens_service.createToken({token, token_expiry_date, user})
    await this.mailerService.sendMail({
      from: '"Geotagger Support <ultimate24208@gmail.com>"',
      to: `${user.email}`,
      subject: 'Your password reset token',
      text: 'Hi. Your password reset token is:',
      html: `<h3>Hi.</h3><p>Your password reset token is: <b>${token}</b>.</p><p>It expires in 15 minutes.</p>`
    })
  }

  async updatePassword(
    user: User,
    updateUserDto: {
      current_password: string;
      password: string;
      confirm_password: string;
    },
  ): Promise<User> {
    if (updateUserDto.password && updateUserDto.confirm_password) {
      if (!(await compareHash(updateUserDto.current_password, user.password)))
        throw new BadRequestException('Incorrect current password');
      if (updateUserDto.password !== updateUserDto.confirm_password)
        throw new BadRequestException('Passwords do not match.');
      if (await compareHash(updateUserDto.password, user.password))
        throw new BadRequestException(
          'New password cannot be the same as old password.',
        );
      user.password = await hash(updateUserDto.password);
    }
    return this.usersRepository.save(user);
  }

  async updateUserImageId(id: number, avatar: string): Promise<User> {
    const user = await this.findById(id);
    if (avatar === user.avatar) {
      throw new BadRequestException('Avatars have to be different.');
    }
    user.avatar = avatar;
    return this.usersRepository.save(user);
  }
}
