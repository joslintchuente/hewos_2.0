
import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
        return this.offerRepository.find();
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
        //OfferObject.questions = offerdto.questions;
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

}




