import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Guess } from './guess.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Location extends Base {
  @Column({ nullable: true })
  name: string;

  @Column({ type: 'decimal', default: 0.0 })
  latitude: number;

  @Column({ type: 'decimal', default: 0.0 })
  longitude: number;

  @Column({ default: 'default_location.png' })
  image_url: string;

  @ManyToOne(() => User, (user) => user.locations, { onDelete: 'SET NULL' })
  user: User;

  @OneToMany(() => Guess, (guess) => guess.location)
  guesses: Guess[];
}
