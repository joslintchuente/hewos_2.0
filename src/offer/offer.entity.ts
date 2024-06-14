import { IsString } from 'class-validator';
import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Offre {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_offre: number;

    @Column()
    @OneToOne(() => User)
    id_user: number;

    @Column()
    prefixe : string;

    @Column()
    intitule: string;

    @Column()
    description: string;

    @Column()
    mode:string;

    @CreateDateColumn()
    date_publication: Date;

    @Column()
    delai: Date;

    @Column()
    photo_post?: string;

    @Column()
    likes?: number;

    @Column()
    commentaires?: number;

    @Column()
    postulants?: number;

    @Column()
    id_postulant?: number;

    @CreateDateColumn()
    date_acquisition?: Date;

    @Column()
    statut_offre?:string;
    



}


