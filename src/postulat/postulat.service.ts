
import { Body,Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Postulat } from './postulat.entity';
import { Offre } from 'src/offer/offer.entity';
import { OfferService } from 'src/offer/offer.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Question } from 'src/question/question.entity';
import { QuestionService } from 'src/question/question.service';
import { Reponse_question } from 'src/reponse_question/reponse_question.entity';
import { Reponse_questionService } from 'src/reponse_question/reponse_question.service';

@Injectable()
export class PostulatService {
    

    constructor(
        @InjectRepository(Postulat)
        private postulatRepository: Repository<Postulat>,
        @InjectRepository(Offre)
        private offreRepository: Repository<Offre>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Question)
        private questionRepository: Repository<Question>,
        @InjectRepository(Reponse_question)
        private reponseRepository: Repository<Reponse_question>
    ) {}

    findAll(): Promise<Postulat[]> {
        return this.postulatRepository.find();
    }

    findOne(id_postulat:number): Promise<Postulat | null> {
        return this.postulatRepository.findOneBy({id_postulat:id_postulat});
    }

    async findMany(id_offre:number):  Promise<any>  {

        let i = 0;
        let userserv: UserService = new UserService(this.userRepository);
        let com2: any[][] = [[], []]; // Initialisation de com2 en tant que tableau de tableaux

        let [comments, count] = await this.postulatRepository.createQueryBuilder('postulat')
        .orderBy("postulat.id_postulat",'DESC')
        .where("postulat.id_offre = :id_offre", { id_offre })
        .getManyAndCount();

        // Placer le nombre de postulants dans com2
        com2[1] = [count];

        // Utiliser une boucle for...of pour gérer les promesses correctement
        for (let element of comments) {
            let comFi = await userserv.findOne({ id_user: element.id_user });
            com2[0].push({ ...element, nom: `${comFi.nom} ${comFi.prenom}` });
            i++;
        }
        //return this.postulatRepository.findOneBy({id_offre:id_offre});
        return com2;
    }

    async insertOne(@Body() body :any){
        // Offer.entity's creation
        let PostulatObject : Postulat = new Postulat();
        let offservice = new OfferService(this.offreRepository);
        let off = offservice.findOne({id_offre:body.id_offre});
        if( off == null){
            throw new Error("L'offre a laquelle vous postulez n'existe pas !");
        }else{
            // sending data from DTO to Entity
            PostulatObject.id_user = body.id_user;
            PostulatObject.id_offre = body.id_offre;
            PostulatObject.date_postulat = new Date();
            if((await off).mode == "selection"){
                
                // insertion of entity
                await this.postulatRepository.insert(PostulatObject).catch((e)=>{
                    throw e;
                });
                await offservice.updatePostulants(body).catch((e)=>{
                    throw e;
                });
            }else{
                // Pour le cas de reponse aux questions
                let questService:QuestionService = new QuestionService(this.questionRepository);
                let repService:Reponse_questionService = new Reponse_questionService(this.reponseRepository);
                await this.postulatRepository.insert(PostulatObject).catch((e)=>{
                    throw e;
                });
                await questService.findMany(body.id_offre).then((result)=>{
                    let reponses:string[] = [];
                    reponses = body.reponses.split('*');
                    
                    if(reponses.length == result[1]){
                        let i = 0;
                        for(let elt in reponses){
                            repService.insertOne(body,reponses[i],result[0][i]);
                            i++;
                        }
                    }else{
                        throw new Error("Nombre de reponses excede le nombre limite "+reponses.length+'>'+result[1]);
                    }
                });
                await offservice.updatePostulants(body).catch((e)=>{
                    throw e;
                });
            }
            
        }
        
        
        
    }

    async remove(id_postulat: number): Promise<void> {
        await this.postulatRepository.delete(id_postulat);
    }


    


}




