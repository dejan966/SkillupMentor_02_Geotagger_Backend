import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateLocationDto {
    @IsOptional()
    name?:string;

    @IsOptional()
    latitude?:number

    @IsOptional()
    longitude?:number

    @IsNotEmpty()
    image_url:string
}
