import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Guess{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.guesses, { onDelete: 'SET NULL' })
  user: User;
}