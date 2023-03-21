import { IsOptional } from "class-validator";

export class CreateGuessDto {
    @IsOptional()
    latitude:number;

    @IsOptional()
    longitude:number;
}
