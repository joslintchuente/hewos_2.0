
import { Body, Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Offre as Offer } from './offer.entity';
import { offerDto } from './offerDto';
import { SelectionCriteria } from './offer.criteria';
import * as fs from 'node:fs/promises';
import * as path from 'path';


@Injectable()
export class OfferService {
    

    constructor(
        @InjectRepository(Offer)
        private offerRepository: Repository<Offer>
    ) {}

    findAll(): Promise<Offer[]> {
        //this.offerRepository.createQueryBuilder('e').orderBy('RANDOM()').limit(7)..getMany()
        return this.offerRepository.find();
    }
    findMany(@Body() body :any,criteria?: SelectionCriteria):  Promise<any> {
        const threeMonthsAgo = new Date(); // Définir la date correspondant à trois mois auparavant
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);


        //let off = this.offerRepository.createQueryBuilder('e').orderBy('RAND()').limit(7).getMany();to_char(offre.date_publication, 'YYYY-MM-DD HH24:MI:SS.US')
        let off = this.offerRepository.createQueryBuilder('offre').orderBy('RAND()').where("offre.date_publication > :threeMonthsAgo", { threeMonthsAgo }).andWhere("offre.id_user != :id", { id: body.id_user }).limit(10).getManyAndCount();
        
        return off;
    }

    findOne(Criteria: SelectionCriteria): Promise<Offer | null> {
        return this.offerRepository.findOneBy(Criteria);
    }

    async insertOne(offerdto : offerDto, photo: Express.Multer.File):Promise<InsertResult>{
        // Offer.entity's creation
        let OfferObject : Offer = new Offer();
        // sending data from DTO to Entity
        OfferObject.id_user = offerdto.id_user;
        OfferObject.prefixe = offerdto.prefixe ;
        OfferObject.intitule = offerdto.intitule ;
        OfferObject.description = offerdto.description;
        OfferObject.mode = offerdto.mode;
        OfferObject.delai = offerdto.delai;
        OfferObject.photo_post = photo.filename;
        OfferObject.statut_offre = "disponible";
        OfferObject.date_publication= new Date();
        
        

        // insertion of entity
        return this.offerRepository.insert(OfferObject)
        
    }

    async remove(telephone: number): Promise<void> {
        await this.offerRepository.delete(telephone);
    }

    async stockerFichier(file: Express.Multer.File, id_user: number, id_offre: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.mkdir('public/images/user/user_' + id_user).catch((e)=>{
                if (e.code !== "EEXIST") throw e;
            });
            fs.mkdir('public/images/user/user_' + id_user + '/publications').catch((e)=>{
                if (e.code !== "EEXIST") throw e;
            });
            fs.mkdir('public/images/user/user_' + id_user + '/publications/pub_'+id_offre).then(()=>{
                const cheminDestination = path.join('public/images/user/user_' + id_user + '/publications/pub_'+id_offre, file.filename);
        
                // Déplacer le fichier vers le dossier de destination
                fs.cp(file.path, cheminDestination).then(() => {
                    fs.rm(file.path);
                    resolve(cheminDestination);
                }).catch((error) => {
                    reject(`Erreur lors du déplacement du fichier : ${error}`);
                });

            }).catch((e)=>{
                if (e.code == "EEXIST") {

                    const cheminDestination = path.join('public/images/user/user_' + id_user + '/publications/pub_'+id_offre, file.filename);
                    // Déplacer le fichier vers le dossier de destination
                    fs.cp(file.path, cheminDestination).then(() => {
                        fs.rm(file.path);
                        resolve(cheminDestination);
                    }).catch((error) => {
                        reject(`Erreur lors du déplacement du fichier : ${error}`);
                    });

                }else{
                    reject(`Erreur lors de la création du dossier de destination : ${e}`);
                }
            });
            
            
        });
    }

    async updateLikes(@Body() body :any):Promise<UpdateResult>{
        let offres = await this.findOne({id_offre:body.id_offre});
        
        return this.offerRepository.update(body.id_offre , {likes : offres.likes + 1 });
        
        
    }
    async updateCom(@Body() body :any):Promise<UpdateResult>{
        let offres = await this.findOne({id_offre:body.id_offre});
        
        return this.offerRepository.update(body.id_offre , {commentaires : offres.commentaires + 1 });
        
        
    }
    async updateComExt(id_offre:number):Promise<UpdateResult>{

        let offres = await this.findOne({id_offre:id_offre});

        return this.offerRepository.update(id_offre , {commentaires : offres.commentaires + 1 });
        
        
    }
    async updatePostulants(@Body() body :any):Promise<UpdateResult>{
        let offres = await this.findOne({id_offre:body.id_offre});
        
        return this.offerRepository.update(body.id_offre , {postulants : offres.postulants + 1 });
        
        
    }
    async updatePostulant(@Body() body :any):Promise<UpdateResult>{
        
        
        return this.offerRepository.update(body.id_offre , {
            id_postulant : body.id_postulant,
            date_acquisition: new Date(),
            statut_offre: "indisponible"
        });
        
        
    }

}




