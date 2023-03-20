import { IsNotEmpty, IsOptional } from "class-validator";
import { Location } from "src/entities/location.entity";
import { User } from "src/entities/user.entity";

export class CreateGuessDto {
    @IsOptional()
    value:boolean;
    
    @IsNotEmpty()
    location:Location
    user:User
}
