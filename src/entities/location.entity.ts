import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Guess } from './guess.entity';

@Entity()
export class Location{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    name:string;

    @Column()
    latitude:number;
    
    @Column()
    longitude:number;

    @OneToMany(() => Guess, (guess) => guess.location)
    guesses: Guess[];
}