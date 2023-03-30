import { IsOptional } from "class-validator";
import { Action } from "entities/action.entity";
import { Component } from "entities/component.entity";

export class UpdateLogDto {
    @IsOptional()
    action?:Action;

    @IsOptional()
    component?:Component;
}
