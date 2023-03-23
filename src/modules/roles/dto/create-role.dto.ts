import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto{
    @IsNotEmpty()
    role:string;
}