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
} from '@nestjs/common';
import { Public } from 'decorators/public.decorator';
import { Response } from 'express';
import { User } from 'entities/user.entity';
import { RequestWithUser } from 'interfaces/auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
