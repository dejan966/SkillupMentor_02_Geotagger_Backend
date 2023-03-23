import { IsOptional } from "class-validator";

export class UpdateGuessDto {
    @IsOptional()
    latitude?:string
    
    @IsOptional()
    longitude?:string

    @IsOptional()
    value?:boolean
}
