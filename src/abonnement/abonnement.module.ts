import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abonnement } from './abonnement.entity';
import { AbonnementService } from './abonnement.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Abonnement,User])],
  providers: [AbonnementService,UserService],
  exports: [TypeOrmModule],
})
export class AbonnementModule {}