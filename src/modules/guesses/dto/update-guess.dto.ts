import { IsOptional } from 'class-validator';

export class UpdateGuessDto {
  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  errorDistance?: number;
}
