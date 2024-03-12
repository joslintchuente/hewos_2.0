import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    nom : string;

    @Column()
    prenom: string;

    @Column()
    telephone: number;

    @Column()
    email: string;

    @Column()
    mot_passe:string;

    @Column()
    id_pays: number;

    @Column()
    monnaie: string;

    @Column()
    profession: string;

    @Column()
    ville: string;

    @Column()
    date_naissance: Date;

    @Column()
    photo?: string;
    
    @IsString()
    statut?: string;


}