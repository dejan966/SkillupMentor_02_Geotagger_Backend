import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @OneToMany(() => Log, (log) => log.action)
  logs: Log[];
}