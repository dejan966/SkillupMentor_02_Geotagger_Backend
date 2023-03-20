import { IsDecimal } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Double } from 'typeorm';
import { Guess } from './guess.entity';

@Entity()
export class Location{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    name:string;

    @Column({type:'decimal', default:0.0})
    latitude:number;
    
    @Column({type:'decimal', default:0.0})
    longitude:number;

    @Column()
    image_url:string
    
    @OneToMany(() => Guess, (guess) => guess.location)
    guesses: Guess[];
}