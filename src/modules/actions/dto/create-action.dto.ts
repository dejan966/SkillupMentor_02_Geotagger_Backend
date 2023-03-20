import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateActionDto {
    @IsOptional()
    action: string;
    
    @IsNotEmpty()
    url: string;
  
    @IsOptional()
    new_value: string;
}
