import { IsString } from 'class-validator';
import { User } from '../user/user.entity';
import { Offre } from 'src/offer/offer.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Commentaire {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_commentaire: number;

    @Column()
    @OneToOne(() => User)
    id_user: number;

    @Column()
    @OneToOne(() => Offre)
    id_offre: number;

    @Column()
    avis: string;

    @CreateDateColumn()
    date_commentaire: Date;

}


