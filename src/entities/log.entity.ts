import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Log{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  new_value: string;
}