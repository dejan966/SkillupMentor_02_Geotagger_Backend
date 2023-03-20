import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Location } from './location.entity';
import { User } from './user.entity';

@Entity()
export class Guess{
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => Location, (location) => location.guesses, { onDelete: 'SET NULL' })
  location: Location;
  
  @ManyToOne(() => User, (user) => user.guesses, { onDelete: 'SET NULL' })
  user: User;

  @Column({type:'decimal', default:0.0})
  latitude:number;
  
  @Column({type:'decimal', default:0.0})
  longitude:number;

  @Column({default:false})
  value:boolean;
}