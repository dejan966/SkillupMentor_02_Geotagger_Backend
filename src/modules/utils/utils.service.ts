import { BadRequestException, ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from 'entities/user.entity';
import { PostgresErrorCode } from 'helpers/postgresErrorCode.enum';
import { JwtType, TokenPayload, CookieType } from 'interfaces/auth.interface';
import Logging from 'library/Logging';
import { UsersService } from 'modules/users/users.service';

export class UtilsService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async hash(data: string, salt = 10) {
    try {
      const generatedSalt = await bcrypt.genSalt(salt);
      return bcrypt.hash(data, generatedSalt);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while hashing the password',
      );
    }
  }

  compareHash(data: string, encryptedData: string) {
    try {
      return bcrypt.compare(data, encryptedData);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException(
        'Something went wrong while comparing the hash',
      );
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
        case JwtType.PASSWORD_TOKEN:
          token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '15m'
          });
          console.log(token)
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
