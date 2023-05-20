import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Base } from './base.entity';

@Entity()
export class Password_Reset_Token extends Base {
  @ManyToOne(() => User, (user) => user.password_reset_tokens, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  token: string;

  @Column({ type: 'timestamp' })
  token_expiry_date: Date;
}
