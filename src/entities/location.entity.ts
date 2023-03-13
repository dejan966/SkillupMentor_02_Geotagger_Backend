import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}