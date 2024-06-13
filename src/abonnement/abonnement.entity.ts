import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,OneToOne,CreateDateColumn} from 'typeorm';

import { User } from '../user/user.entity';


@Entity()
export class Abonnement {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_abonnement: number;


    @Column()
    @OneToOne(() => User)
    id_user: number;

    @Column()
    @OneToOne(() => User)
    id_user_asso_14: number;

    @CreateDateColumn()
    date_abonnement: Date;


}