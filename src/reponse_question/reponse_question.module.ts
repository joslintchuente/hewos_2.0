import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reponse_question } from './reponse_question.entity';
import { Reponse_questionService } from './reponse_question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reponse_question])],
  providers: [Reponse_questionService],
  exports: [TypeOrmModule],
})
export class Reponse_questionModule {}