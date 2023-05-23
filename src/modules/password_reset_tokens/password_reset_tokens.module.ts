import { Module } from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { PasswordResetTokensController } from './password_reset_tokens.controller';
import { Password_Reset_Token } from 'entities/password_reset_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([Password_Reset_Token])
  ],
  controllers: [PasswordResetTokensController],
  providers: [PasswordResetTokensService, JwtService]
})
export class PasswordResetTokensModule {}
