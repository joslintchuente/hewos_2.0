import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offre } from 'src/offer/offer.entity';
import { OfferService } from 'src/offer/offer.service';
import { Postulat } from './postulat.entity';
import { PostulatService } from './postulat.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Question } from 'src/question/question.entity';
import { QuestionService } from 'src/question/question.service';
import { Reponse_question } from 'src/reponse_question/reponse_question.entity';
import { Reponse_questionService } from 'src/reponse_question/reponse_question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Postulat,Offre,User,Question,Reponse_question])],
  providers: [OfferService,PostulatService,UserService,QuestionService,Reponse_questionService],
  exports: [TypeOrmModule],
})
export class PostulatModule {}