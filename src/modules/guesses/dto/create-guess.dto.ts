import { IsNotEmpty } from 'class-validator';

export class CreateGuessDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  errorDistance: number;
}
