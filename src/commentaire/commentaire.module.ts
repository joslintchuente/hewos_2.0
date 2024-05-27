import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre } from 'src/offer/offer.entity';
import { OfferService } from 'src/offer/offer.service';
import { Commentaire } from './commentaire.entity';
import { CommentaireService } from './commentaire.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offre,Commentaire,User])],
  providers: [OfferService,CommentaireService,UserService],
  exports: [TypeOrmModule],
})
export class CommentaireModule {}