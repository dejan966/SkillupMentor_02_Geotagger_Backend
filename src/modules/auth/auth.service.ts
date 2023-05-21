import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'entities/user.entity';
import Logging from 'library/Logging';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UtilsService } from 'modules/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private utilsService: UtilsService
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
    const hashedPassword: string = await this.utilsService.hash(registerUserDto.password);
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    });
    return user;
  }

  async generateJwt(user: User) {
    return this.jwtService.signAsync({ sub: user.id, name: user.email });
  }
}
