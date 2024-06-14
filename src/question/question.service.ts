
import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
    

    constructor(
        @InjectRepository(Question)
        private questionRepository: Repository<Question>
    ) {}

    findAll(): Promise<Question[]> {
        return this.questionRepository.find();
    }

    findOne(id_offre:number): Promise<Question | null> {
        return this.questionRepository.findOneBy({id_offre:id_offre});
    }
    async findMany(id_offre:number): Promise<any> {
        let i = 0;
        let com2: any[][] = [[], []]; // Initialisation de com2 en tant que tableau de tableaux

        let [questions, count] = await this.questionRepository.createQueryBuilder('question').orderBy('question.id_question','ASC').where("question.id_offre = :id_offre",{id_offre}).getManyAndCount();
        
        // Placer le nombre de postulants dans com2
        com2[1] = [count];

        // Utiliser une boucle for...of pour gérer les promesses correctement
        for (let element of questions) {
            com2[0].push(element.id_question);
            i++;
        }
        
        return com2;
    }

    async insertOne(libelle: string, id_offre: number){
        // Offer.entity's creation
        let QuestionObject : Question = new Question();
        
        // sending data from DTO to Entity
        QuestionObject.libelle = libelle;
        QuestionObject.id_offre = id_offre;
        QuestionObject.reponses = null;
        // insertion of entity
        await this.questionRepository.insert(QuestionObject).catch((e)=>{
            throw e;
        });
        
    }

    async remove(id_question: number): Promise<void> {
        await this.questionRepository.delete(id_question);
    }


}




