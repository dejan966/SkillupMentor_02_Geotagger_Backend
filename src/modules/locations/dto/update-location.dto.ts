import { IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  image_url?: number;
}
