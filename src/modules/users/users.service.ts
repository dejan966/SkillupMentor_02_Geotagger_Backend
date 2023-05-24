import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UtilsService } from 'modules/utils/utils.service';
import { PasswordResetTokensService } from 'modules/password_reset_tokens/password_reset_tokens.service';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly passwordResetService: PasswordResetTokensService
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
    if (user) {
      return this.sendEmail(user);
    }
  }

  async sendEmail(user: User) {
    const userToken = await this.passwordResetService.findByUser(user);
    if (userToken) {
      throw new BadRequestException(
        'User already requested token for password reset.',
      );
    }

/*     const password_token = await this.authService.generateToken(
      user,
      JwtType.PASSWORD_TOKEN,
    ); */
    const token = Math.random().toString(36).slice(2, 12);
/*     const currDate = new Date();
    const token_expiry_date = new Date(currDate.getTime() + 15 * 60000);

    await this.passwordResetService.createToken({
      token,
      token_expiry_date,
      user,
    }); */
    const response = await this.mailerService.sendMail({
      from: 'Geotagger Support <ultimate24208@gmail.com>',
      to: user.email,
      subject: 'Your password reset token',
      text: `Hi.<p>Your password reset link is: </p><p>It expires in 15 minutes.</p>`,
      html: `Hi.<p>Your password reset link is: http://localhost:3000/me/update-password?token=${token}.</p><p>It expires in 15 minutes.</p>`,
    });
    return response;
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
      if (!(await this.utilsService.compareHash(updateUserDto.current_password, user.password)))
        throw new BadRequestException('Incorrect current password');
      if (updateUserDto.password !== updateUserDto.confirm_password)
        throw new BadRequestException('Passwords do not match.');
      if (await this.utilsService.compareHash(updateUserDto.password, user.password))
        throw new BadRequestException(
          'New password cannot be the same as old password.',
        );
      user.password = await this.utilsService.hash(updateUserDto.password);
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
