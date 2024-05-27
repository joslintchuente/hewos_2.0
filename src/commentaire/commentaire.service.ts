
import { Body, Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { commentaireDto } from './commentaireDto';
import { Commentaire } from './commentaire.entity';
import { Offre } from 'src/offer/offer.entity';
import { User } from 'src/user/user.entity';
import { OfferService } from 'src/offer/offer.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { resolve } from 'path';
import { number } from 'zod';

@Injectable()
export class CommentaireService {

    constructor(
        @InjectRepository(Commentaire)
        private CommentaireRepository: Repository<Commentaire>,
        @InjectRepository(Offre)
        private OffreRepository: Repository<Offre>,
        @InjectRepository(User)
        private UserRepository: Repository<User>,
    ) {}

    findAll(): Promise<Commentaire[]> {
        return this.CommentaireRepository.find();
    }

    findOne(id_commentaire: number): Promise<Commentaire | null> {
        return this.CommentaireRepository.findOneBy({ id_commentaire : id_commentaire });
    }
    
    async findMany(@Body() body :any):  Promise<any> {
        let i = 0;
        let id_offre = body.id_offre;
        let userserv: UserService = new UserService(this.UserRepository);
        let com2: any[][] = [[], []]; // Initialisation de com2 en tant que tableau de tableaux

        // Récupération des 10 derniers commentaires pour une publication donnée
        let [comments, count] = await this.CommentaireRepository.createQueryBuilder('commentaire')
            .orderBy("commentaire.id_commentaire", "DESC")
            .where("commentaire.id_offre = :id_offre", { id_offre })
            .limit(7)
            .getManyAndCount();

        // Placer le nombre de commentaires dans com2
        com2[1] = [count];

        // Utiliser une boucle for...of pour gérer les promesses correctement
        for (let element of comments) {
            let comFi = await userserv.findOne({ id_user: element.id_user });
            com2[0].push({ ...element, nom: `${comFi.nom} ${comFi.prenom}` });
            i++;
        }

        return com2;
        
    }

    async insertOne(Commentairedto : commentaireDto){
        // Commentaire.entity's creation
        let CommentaireObject : Commentaire = new Commentaire();

        // sending data from DTO to Entity
        CommentaireObject.avis = Commentairedto.avis ;
        CommentaireObject.date_commentaire = new Date();
        CommentaireObject.id_offre = Commentairedto.id_offre ;
        CommentaireObject.id_user = Commentairedto.id_user;

        // Call of offer services
        let OfferServ : OfferService = new OfferService(this.OffreRepository);

        // insertion of entity
        try{
            await this.CommentaireRepository.insert(CommentaireObject)
            await OfferServ.updateComExt(Commentairedto.id_offre);

        }catch(e){
            console.error(e);
            throw e;
        }
        
        
        
    }

    async remove(@Body() body :any): Promise<void> {
        await this.CommentaireRepository.delete(body.id_commentaire);
    }


}








