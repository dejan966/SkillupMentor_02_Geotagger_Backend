import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { Guess } from './guess.entity';
import { User } from './user.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @OneToMany(() => Guess, (guess) => guess.location)
  guesses: Guess[];
}
