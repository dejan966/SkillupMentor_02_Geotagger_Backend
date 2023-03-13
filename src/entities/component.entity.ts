import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Log } from './log.entity';

@Entity()
export class Component{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  component: string;

  @OneToMany(() => Log, (log) => log.component)
  logs: Log[];
}