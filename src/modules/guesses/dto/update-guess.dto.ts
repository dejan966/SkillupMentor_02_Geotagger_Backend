import { IsOptional } from "class-validator";
import { Location } from "src/entities/location.entity";

export class CreateGuessDto {
    @IsOptional()
    location:Location
}
