import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Public } from 'decorators/public.decorator';
import { Response } from 'express';
import { User } from 'entities/user.entity';
import {
  CookieType,
  JwtType,
  RequestWithUser,
} from 'interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUser } from 'decorators/get-current-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { user } = req;

    const access_token = await this.authService.generateToken(
      user,
      JwtType.ACCESS_TOKEN,
    );
    const refresh_token = await this.authService.generateToken(
      user,
      JwtType.REFRESH_TOKEN,
    );

    const access_token_cookie = await this.authService.generateCookie(
      access_token,
      CookieType.ACCESS_TOKEN,
    );
    const refresh_token_cookie = await this.authService.generateCookie(
      refresh_token,
      CookieType.REFRESH_TOKEN,
    );
    try {
      await this.authService.updateRtHash(user.id, refresh_token);
      res
        .setHeader('Set-Cookie', [access_token_cookie, refresh_token_cookie])
        .json({ ...user });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while setting cookies into response header',
      );
    }
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetCurrentUser() userData: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signout(userData.id, res);
  }
}
