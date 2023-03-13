import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Image } from './image.entity';
import { Location } from './location.entity';
import { User } from './user.entity';

@Entity()
export class Guess{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Image, (image) => image.guesses, { onDelete: 'SET NULL' })
  image: Image;
  
  @ManyToOne(() => Location, (location) => location.guesses, { onDelete: 'SET NULL' })
  location: Location;
  
  @ManyToOne(() => User, (user) => user.guesses, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  value:boolean;
}