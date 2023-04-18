import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateActionDto {
  @IsNotEmpty()
  action: string;

  @IsNotEmpty()
  url: string;

  @IsOptional()
  new_value?: string;
}
