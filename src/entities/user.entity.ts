import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Guess } from './guess.entity';
import { Log } from './log.entity';
import { Role } from './role.entity';
import { Location } from './location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 'default_profile.png' })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  role: Role;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
  
  @OneToMany(() => Guess, (guess) => guess.user)
  guesses: Guess[];

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[];
}
