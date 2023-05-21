import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UtilsService } from 'modules/utils/utils.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, UtilsService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
