
import { Body,Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reponse_question } from './reponse_question.entity';

@Injectable()
export class Reponse_questionService {
    

    constructor(
        @InjectRepository(Reponse_question)
        private reponse_questionRepository: Repository<Reponse_question>
    ) {}

    findAll(): Promise<Reponse_question[]> {
        return this.reponse_questionRepository.find();
    }

    findOne(id_reponse:number): Promise<Reponse_question | null> {
        return this.reponse_questionRepository.findOneBy({id_reponse:id_reponse});
    }
    async findMany(id_question:number): Promise<any> {
        let i = 0;
        let com2: any[][] = [[], []]; // Initialisation de com2 en tant que tableau de tableaux

        let [Reponse_questions, count] = await this.reponse_questionRepository.createQueryBuilder('reponse_question').orderBy('reponse_question.id_question','ASC').where("reponse_question.id_question = :id_question",{id_question}).getManyAndCount();
        
        // Placer le nombre de postulants dans com2
        com2[1] = [count];

        // Utiliser une boucle for...of pour gérer les promesses correctement
        for (let element of Reponse_questions) {
            com2[0].push(element.id_question);
            i++;
        }
        
        return com2;
    }

    async insertOne(@Body() body :any,reponse:string,id_question:number){
        // Offer.entity's creation
        let Reponse_questionObject : Reponse_question = new Reponse_question();
        
        // sending data from DTO to Entity
        Reponse_questionObject.id_question = id_question;
        Reponse_questionObject.id_user = body.id_user;
        Reponse_questionObject.proposition = reponse;
        // insertion of entity
        await this.reponse_questionRepository.insert(Reponse_questionObject).catch((e)=>{
            throw e;
        });
        
    }

    async remove(id_reponse: number): Promise<void> {
        await this.reponse_questionRepository.delete(id_reponse);
    }


}




