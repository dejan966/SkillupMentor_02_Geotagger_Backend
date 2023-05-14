import { IsNotEmpty } from "class-validator";
import { User } from "entities/user.entity";

export class CreatePasswordResetTokenDto {
    @IsNotEmpty()
    token:string;

    @IsNotEmpty()
    token_expiry_date: Date;

    @IsNotEmpty()
    user: User;
}
