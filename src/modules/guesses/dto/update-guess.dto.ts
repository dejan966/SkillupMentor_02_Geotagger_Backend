import { IsOptional } from 'class-validator';

export class UpdateGuessDto {
  @IsOptional()
  errorDistance?: number;
}
