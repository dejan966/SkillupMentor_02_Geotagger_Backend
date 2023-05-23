import { Exclude } from 'class-transformer';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Guess } from './guess.entity';
import { Role } from './role.entity';
import { Location } from './location.entity';
import { Password_Reset_Token } from './password_reset_token.entity';
import { Base } from './base.entity';

@Entity()
export class User extends Base {
  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 'default_profile.svg' })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, default: null })
  @Exclude()
  refresh_token: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'SET NULL' })
  role: Role;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @OneToMany(() => Guess, (guess) => guess.user)
  guesses: Guess[];

  @OneToMany(
    () => Password_Reset_Token,
    (password_reset_token) => password_reset_token.user,
  )
  password_reset_tokens: Password_Reset_Token[];
}
