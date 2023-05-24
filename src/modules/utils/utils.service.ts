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

  async generateCookie(token: string, type: CookieType): Promise<string> {
    try {
      let cookie: string;
      switch (type) {
        case CookieType.ACCESS_TOKEN:
          cookie = `access_token=${token}; HttpOnly; Path =/; Max-Age=${this.configService.get('JWT_SECRET_EXPIRES')}; SameSite:strict`;
          break;
        case CookieType.REFRESH_TOKEN:
          cookie = `refresh_token=${token}; HttpOnly; Path =/; Max-Age=${this.configService.get('JWT_REFRESH_SECRET_EXPIRES')}; SameSite:strict`;
          break;
        default:
          throw new BadRequestException('Access denied');
      }
      return cookie;
    } catch (error) {
      Logging.error(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.');
      }
      throw new InternalServerErrorException('Something went wrong while generating a new cookie.');
    }
  }

  async refreshTokens(req: Request): Promise<User> {
    const user = await this.usersService.findBy({ refresh_token: req.cookies.refresh_token });
    if (!user) {
      throw new ForbiddenException();
    }
    try {
      await this.jwtService.verifyAsync(user.refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      Logging.error(error);
      throw new UnauthorizedException('Something went wrong while refreshing tokens');
    }
    const token = await this.generateToken(user, JwtType.ACCESS_TOKEN);
    const cookie = await this.generateCookie(token, CookieType.ACCESS_TOKEN);

    try {
      req.res.setHeader('Set-Cookie', cookie);
    } catch (error) {
      Logging.error(error);
      throw new InternalServerErrorException('Something went wrong while setting cookies into the response header');
    }
    return user;
  }
}
