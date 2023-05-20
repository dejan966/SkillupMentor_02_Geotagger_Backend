import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Role extends Base {
  @Column()
  role: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
