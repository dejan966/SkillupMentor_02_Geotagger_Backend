import { Entity, Column, ManyToOne } from 'typeorm';
import { Location } from './location.entity';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Guess extends Base {
  @Column({ type: 'decimal', default: 0.0 })
  latitude: number;

  @Column({ type: 'decimal', default: 0.0 })
  longitude: number;

  @Column()
  errorDistance: number;

  @ManyToOne(() => Location, (location) => location.guesses, {
    onDelete: 'SET NULL',
  })
  location: Location;

  @ManyToOne(() => User, (user) => user.guesses, {
    onDelete: 'SET NULL',
  })
  user: User;
}
