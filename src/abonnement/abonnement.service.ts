
import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abonnement } from './abonnement.entity';
import { abonnementDto } from './abonnementDto';



@Injectable()
export class AbonnementService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Abonnement)
        private abonnementRepository: Repository<Abonnement>
    ) {}

    findAll(): Promise<Abonnement[]> {
        return this.abonnementRepository.find();
    }

    findOne(): Promise<Abonnement | null> {
        return null
    }

    async insertOne(abonnementdto : abonnementDto){
        // abonnement.entity's creation
        let AbonnementObject : Abonnement = new Abonnement();

        // sending data from DTO to Entity
        AbonnementObject.id_user = abonnementdto.id_user ;
        AbonnementObject.id_user_asso_14 = abonnementdto.follower_id;
        AbonnementObject.date_abonnement = new Date() ;
        


        // insertion of entity
        await this.abonnementRepository.insert(AbonnementObject);
        
    }

    async remove(id_user: number): Promise<void> {

        await this.abonnementRepository.delete(id_user);
    }


}





@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);  
}



