
import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Offre as Offer } from './offer.entity';
import { offerDto } from './offerDto';
import { SelectionCriteria } from './offer.criteria';


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
        console.log(photo.destination)
        // sending data from DTO to Entity
        OfferObject.id_user = offerdto.id_user;
        OfferObject.prefixe = offerdto.prefixe ;
        OfferObject.intitule = offerdto.intitule ;
        OfferObject.description = offerdto.description;
        OfferObject.mode = offerdto.mode;
        OfferObject.delai = offerdto.delai;
        OfferObject.photo_post = photo.destination;
        //OfferObject.questions = offerdto.questions;
        OfferObject.date_publication= new Date();
        
        

        // insertion of entity
        return this.offerRepository.insert(OfferObject)
        
    }

    async remove(telephone: number): Promise<void> {
        await this.offerRepository.delete(telephone);
    }


}




