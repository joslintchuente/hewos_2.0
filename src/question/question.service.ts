
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




