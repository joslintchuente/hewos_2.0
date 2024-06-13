import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre } from 'src/offer/offer.entity';
import { OfferService } from 'src/offer/offer.service';
import { Postulat } from './postulat.entity';
import { PostulatService } from './postulat.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Postulat,Offre,User])],
  providers: [OfferService,PostulatService,UserService],
  exports: [TypeOrmModule],
})
export class PostulatModule {}