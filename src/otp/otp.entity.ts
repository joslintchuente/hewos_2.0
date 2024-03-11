import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OTP {
  constructor(){}

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @Column()
  date: Date;

  @Column({ default: 1 })
  isActive: number;
}