import { IsOptional } from 'class-validator';

export class UpdateComponentDto {
    @IsOptional()
    name:string
}
