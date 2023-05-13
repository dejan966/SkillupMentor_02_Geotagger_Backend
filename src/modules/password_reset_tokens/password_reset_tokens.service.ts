import { Injectable } from '@nestjs/common';
import { CreatePasswordResetTokenDto } from './dto/create-password_reset_token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password_reset_token.dto';
import { Password_Reset_Token } from 'entities/password_reset_token';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    @InjectRepository(Password_Reset_Token)
    private readonly password_token_repository: Repository<Password_Reset_Token>,
  ) {}

  async createToken(createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    const newToken = await this.password_token_repository.create({
      ...createPasswordResetTokenDto,
    });
    return this.password_token_repository.save(newToken);
  }

  async findAll() {
    return `This action returns all passwordResetTokens`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} passwordResetToken`;
  }

  async update(
    id: number,
    updatePasswordResetTokenDto: UpdatePasswordResetTokenDto,
  ) {
    return `This action updates a #${id} passwordResetToken`;
  }

  async removeToken(id: number) {
    return this.password_token_repository.delete(id);
  }
}
