import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password_Reset_Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.password_reset_tokens, { onDelete: 'SET NULL' })
  user: User;

  @Column()
  token: string;

  @Column({ type: 'date' })
  token_expiry_date: Date;
}
