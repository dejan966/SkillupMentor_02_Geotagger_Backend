import { IsNotEmpty, IsOptional } from "class-validator";
import { Action } from "src/entities/action.entity";
import { Component } from "src/entities/component.entity";
import { User } from "src/entities/user.entity";

export class CreateLogDto {
    @IsOptional()
    action?:Action;

    @IsNotEmpty()
    component:Component
    user:User
}
