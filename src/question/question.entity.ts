import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,OneToOne} from 'typeorm';
import { Offre as Offer } from 'src/offer/offer.entity';

@Entity()
export class Question {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_question: number;

    @Column()
    @OneToOne(() => Offer)
    id_offre: number;

    @Column()
    libelle: string;

    @Column()
    reponses?: string;


}