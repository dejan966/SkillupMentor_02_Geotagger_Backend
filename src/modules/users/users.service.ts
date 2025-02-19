import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AbstractService } from 'modules/common/abstract.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UtilsService } from 'modules/utils/utils.service';
import { JwtType } from 'interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'interfaces/jwt-payload.interface';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
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

  async checkToken(user: User, hashed_token: string) {
    if (
      await this.utilsService.compareHash(user.password_token, hashed_token)
    ) {
      const decoded = this.jwtService.decode(user.password_token);
      const updatedJwtPayload: IJwtPayload = decoded as IJwtPayload;
      const expires = new Date(updatedJwtPayload.exp * 1000).toLocaleString();
      const curr = new Date().toLocaleString();
      if (user && curr < expires) {
        return true;
      }
    }

    return false;
  }

  async checkEmail(userEmail: string) {
    const user = await this.findBy({ email: userEmail });
    if (user) {
      return this.sendEmail(user);
    }
  }

  async sendEmail(user: User) {
    const { password_token } = user;

    if (password_token) {
      const decoded = this.jwtService.decode(password_token);
      const updatedJwtPayload: IJwtPayload = decoded as IJwtPayload;
      const expires = new Date(updatedJwtPayload.exp * 1000).toLocaleString();
      const curr = new Date().toLocaleString();
      if (curr < expires) {
        throw new BadRequestException('User already requested the token.');
      }
    }

    const type = JwtType.PASSWORD_TOKEN;
    const token = await this.jwtService.signAsync(
      { sub: user.id, name: user.email, type },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '900s',
      },
    );

    const hashed = await this.utilsService.hash(token);

    await this.update(user.id, { password_token: token });
    const response = await this.mailerService.sendMail({
      from: 'Geotagger Support <ultimate24208@gmail.com>',
      to: user.email,
      subject: 'Your password reset token',
      text: `Hi.<p>Your password reset link is: </p><p>It expires in 15 minutes.</p>`,
      html: `Hi.<p>Your password reset link is <a href="http://localhost:3000/me/update-password?token=${hashed}">here</a>.</p><p>It expires in 15 minutes.</p>`,
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
      if (
        !(await this.utilsService.compareHash(
          updateUserDto.current_password,
          user.password,
        ))
      )
        throw new BadRequestException('Incorrect current password');
      if (updateUserDto.password !== updateUserDto.confirm_password)
        throw new BadRequestException('Passwords do not match.');
      if (
        await this.utilsService.compareHash(
          updateUserDto.password,
          user.password,
        )
      )
        throw new BadRequestException(
          'New password cannot be the same as old password.',
        );
      user.password = await this.utilsService.hash(updateUserDto.password);
    }
    user.password_token = null;
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
