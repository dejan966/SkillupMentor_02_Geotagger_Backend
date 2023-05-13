import { PartialType } from '@nestjs/swagger';
import { CreatePasswordResetTokenDto } from './create-password_reset_token.dto';

export class UpdatePasswordResetTokenDto extends PartialType(CreatePasswordResetTokenDto) {}
