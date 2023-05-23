import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UtilsService } from 'modules/utils/utils.service';
import { JwtType, TokenPayload } from 'interfaces/auth.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...');
    const user = await this.usersService.findBy({ email: email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await this.utilsService.compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    Logging.info('User is valid');
    return user;
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await this.utilsService.hash(
      registerUserDto.password,
    );
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    try {
      await this.usersService.update(userId, { refresh_token: rt });
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while updating user refresh token');
    }
  }

  async generateToken(user: User, type: JwtType) {
    const payload: TokenPayload = { sub: user.id, name: user.email, type };
    let token: string;
    try {
      switch (type) {
        case JwtType.ACCESS_TOKEN:
          token = await this.jwtService.signAsync(payload);
          break;
        case JwtType.REFRESH_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
          });
          break;
        default:
          throw new BadRequestException('Access denied');
      }
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while generating a new token.',
      );
    }
    return token;
  }
}
