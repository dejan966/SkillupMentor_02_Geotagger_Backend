import { IsOptional } from 'class-validator';

export class UpdateActionDto {
    @IsOptional()
    action?: string;
    
    @IsOptional()
    url?: string;
  
    @IsOptional()
    new_value?: string;
}
