import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Guess{
  @PrimaryGeneratedColumn()
  id: number;

  
}