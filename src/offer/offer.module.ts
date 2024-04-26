import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre as Offer } from './offer.entity';
import { OfferService } from './offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  exports: [TypeOrmModule],
})
export class OfferModule {}