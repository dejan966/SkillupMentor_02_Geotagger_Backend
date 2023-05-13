import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password_reset_token.dto';

@Controller('password-reset-tokens')
export class PasswordResetTokensController {
  constructor(private readonly passwordResetTokensService: PasswordResetTokensService) {}

  @Post()
  async create(@Body() createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return this.passwordResetTokensService.createToken(createPasswordResetTokenDto);
  }

  @Get()
  async findAll() {
    return this.passwordResetTokensService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.passwordResetTokensService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePasswordResetTokenDto: UpdatePasswordResetTokenDto) {
    return this.passwordResetTokensService.update(id, updatePasswordResetTokenDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.passwordResetTokensService.removeToken(id);
  }
}
