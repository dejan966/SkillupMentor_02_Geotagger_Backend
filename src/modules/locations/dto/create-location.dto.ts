import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;
}
