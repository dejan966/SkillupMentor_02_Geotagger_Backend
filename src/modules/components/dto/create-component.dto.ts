import { IsNotEmpty } from "class-validator";

export class CreateComponentDto {
    @IsNotEmpty()
    name:string
}
