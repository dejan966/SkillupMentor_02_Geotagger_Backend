import { IsNotEmpty } from "class-validator";
import { User } from "entities/user.entity";

export class CreatePasswordResetTokenDto {
    @IsNotEmpty()
    token:string;

    @IsNotEmpty()
    token_expiry_date: string;

    @IsNotEmpty()
    user: User;
}
