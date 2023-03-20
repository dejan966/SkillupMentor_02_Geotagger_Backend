import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Log } from './log.entity';

@Entity()
export class Action{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;
  
  @Column()
  url: string;

  @Column({ nullable: true })
  new_value: string;

  @OneToMany(() => Log, (log) => log.action)
  logs: Log[];
}