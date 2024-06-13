import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,OneToOne,CreateDateColumn} from 'typeorm';
import { Offre as Offer } from 'src/offer/offer.entity';
import { User } from '../user/user.entity';


@Entity()
export class Postulat {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_postulat: number;

    @Column()
    @OneToOne(() => Offer)
    id_offre: number;

    @Column()
    @OneToOne(() => User)
    id_user: number;

    @CreateDateColumn()
    date_postulat: Date;


}