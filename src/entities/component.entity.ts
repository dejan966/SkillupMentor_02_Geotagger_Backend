import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Log } from './log.entity';

@Entity()
export class Component{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  component: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @OneToMany(() => Log, (log) => log.component)
  logs: Log[];
}