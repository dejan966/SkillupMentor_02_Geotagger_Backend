import { Injectable } from '@nestjs/common';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password_reset_token.dto';

@Injectable()
export class PasswordResetTokensService {
  async create(createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return 'This action adds a new passwordResetToken';
  }

  async findAll() {
    return `This action returns all passwordResetTokens`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} passwordResetToken`;
  }

  async update(id: number, updatePasswordResetTokenDto: UpdatePasswordResetTokenDto) {
    return `This action updates a #${id} passwordResetToken`;
  }

  async remove(id: number) {
    return `This action removes a #${id} passwordResetToken`;
  }
}
