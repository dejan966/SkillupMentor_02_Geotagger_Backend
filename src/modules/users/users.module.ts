import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { PasswordResetTokensService } from 'modules/password_reset_tokens/password_reset_tokens.service';
import { Password_Reset_Token } from 'entities/password_reset_token.entity';
import { UtilsService } from 'modules/utils/utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Password_Reset_Token]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UtilsService, PasswordResetTokensService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
