import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}