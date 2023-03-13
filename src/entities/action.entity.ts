import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Action{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;
  
  @Column()
  url: string;
}