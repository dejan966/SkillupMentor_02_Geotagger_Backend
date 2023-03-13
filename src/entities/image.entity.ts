import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Guess } from './guess.entity';
import { User } from './user.entity';

@Entity()
export class Image{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url:string;

  @ManyToOne(() => User, (user) => user.images, { onDelete: 'SET NULL' })
  user: User;

 
}