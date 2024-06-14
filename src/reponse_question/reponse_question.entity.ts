import { IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn ,OneToOne} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Question } from 'src/question/question.entity';

@Entity()
export class Reponse_question {
    constructor(){}

    @PrimaryGeneratedColumn()
    id_reponse: number;

    @Column()
    @OneToOne(() => Question)
    id_question: number;

    @Column()
    @OneToOne(() => User)
    id_user: number;

    @Column()
    proposition: string;



}