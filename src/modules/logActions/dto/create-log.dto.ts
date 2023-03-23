import { IsNotEmpty, IsOptional } from "class-validator";
import { Action } from "src/entities/action.entity";
import { Component } from "src/entities/component.entity";

export class CreateLogDto {
    @IsNotEmpty()
    action:Action;

    @IsOptional()
    component?:Component
}
