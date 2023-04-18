import { IsNotEmpty, IsOptional } from 'class-validator';
import { Action } from 'entities/action.entity';
import { Component } from 'entities/component.entity';

export class CreateLogDto {
  @IsNotEmpty()
  action: Action;

  @IsOptional()
  component?: Component;
}
