import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Request, Response } from 'express'
import { PostgresErrorCode } from 'src/helpers/postgresErrorCode.enum';
import { JwtType, TokenPayload } from 'src/interfaces/auth.interface';
import { UserData } from 'src/interfaces/user.interface';
import Logging from 'src/library/Logging';
import { UsersService } from '../users/users.service';
import { compareHash, hash } from 'src/utils/bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...')
    const user = await this.usersService.findBy({ email: email })
    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials')
    }
    Logging.info('User is valid')
    return user
  }
  
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword: string = await hash(registerUserDto.password)
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword,
    })
    return user
  }

  async generateJwt(user:User){
    return this.jwtService.signAsync({ sub:user.id, name:user.email})
  }
}
