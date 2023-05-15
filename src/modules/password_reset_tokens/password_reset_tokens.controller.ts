import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard';

@Controller('password-reset-tokens')
export class PasswordResetTokensController {
  constructor(private readonly passwordResetTokensService: PasswordResetTokensService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return this.passwordResetTokensService.createToken(createPasswordResetTokenDto);
  }

  @Get('/user/:token')
  @UseGuards(JwtAuthGuard)
  async findByToken(@Param('token') token: string){
    return this.passwordResetTokensService.findByToken(token);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.passwordResetTokensService.findAll(['user']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: number){
    return this.passwordResetTokensService.findById(id, ['user']);
  }

  @Delete('/delete/:token')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('token') token: string) {
    return this.passwordResetTokensService.removeToken(token);
  }
}
