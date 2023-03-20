import { IsOptional } from "class-validator";

export class UpdateGuessDto {
    @IsOptional()
    latitude:string
    
    @IsOptional()
    lomgitude:string
}
