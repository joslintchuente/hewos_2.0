import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OtpModule } from './otp/otp.module'; 
import { OTP } from './otp/otp.entity';
import { OtpService } from './otp/otp.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthService } from './authentication/auth.service';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import { OfferService } from './offer/offer.service';
import { QuestionService } from './question/question.service';
import { Offre as Offer } from './offer/offer.entity';
import { OfferModule } from './offer/offer.module';
import { QuestionModule } from './question/question.module';
import { Question } from './question/question.entity';
import { CommentaireModule } from './commentaire/commentaire.module';
import { CommentaireService } from './commentaire/commentaire.service';
import { Commentaire } from './commentaire/commentaire.entity';
import { Postulat } from './postulat/postulat.entity';
import { PostulatService } from './postulat/postulat.service';
import { PostulatModule } from './postulat/postulat.module';
import { Abonnement } from './abonnement/abonnement.entity';
import { AbonnementService } from './abonnement/abonnement.service';
import { AbonnementModule } from './abonnement/abonnement.module';
import { Reponse_question } from './reponse_question/reponse_question.entity';
import { Reponse_questionService } from './reponse_question/reponse_question.service';
import { Reponse_questionModule } from './reponse_question/reponse_question.module';
import { LoggerMiddleware } from './middleware/Logger.Middleware';





@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port:  parseInt(process.env.PORT) ,
      username: 'root',
      password: process.env.PASSWORD,
      database: 'hewos',
      entities: [OTP,User,Offer,Question,Commentaire,Postulat,Abonnement,Reponse_question],
      synchronize: Boolean(process.env.SYNCHRONIZE_DEV),
      
    }),
    OtpModule, 
    ScheduleModule.forRoot(),
    UserModule,
    OfferModule,
    QuestionModule,
    CommentaireModule,
    PostulatModule,
    AbonnementModule,
    Reponse_questionModule
  ],
  controllers: [AppController],
  providers: [AppService,OtpService,AuthService,UserModule,UserService,JwtService,OfferService,QuestionService,CommentaireService,PostulatService,AbonnementService,Reponse_questionService],
})
export class AppModule implements NestModule  {
  constructor(private dataSource: DataSource) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
  
}
