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
  Get
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Response, Request } from 'express';
import { User } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, { httpOnly:true })
    return req.user
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res({passthrough:true}) res: Response) {
    res.clearCookie('access_token')
    return {msg:'ok'}
  }
}
