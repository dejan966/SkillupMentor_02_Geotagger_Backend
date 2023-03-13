import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Component{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  component: string;
}