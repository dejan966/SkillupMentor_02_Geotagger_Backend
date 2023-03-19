import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Action } from './action.entity';
import { Component } from './component.entity';
import { User } from './user.entity';

@Entity()
export class Log{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Action, (action) => action.logs, { onDelete: 'SET NULL' })
  action: Action;
  
  @ManyToOne(() => Component, (component) => component.logs, { onDelete: 'SET NULL' })
  component: Component;

  @ManyToOne(() => User, (user) => user.logs, { onDelete: 'SET NULL' })
  user: User;
}