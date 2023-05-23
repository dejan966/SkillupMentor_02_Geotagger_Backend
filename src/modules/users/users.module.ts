import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { PasswordResetTokensService } from 'modules/password_reset_tokens/password_reset_tokens.service';
import { Password_Reset_Token } from 'entities/password_reset_token.entity';
import { UtilsService } from 'modules/utils/utils.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Password_Reset_Token]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, UtilsService, PasswordResetTokensService],
  exports: [UsersService],
})
export class UsersModule {}
