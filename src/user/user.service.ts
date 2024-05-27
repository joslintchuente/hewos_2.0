
import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { userDto } from './userDto';
import * as bcrypt from 'bcrypt';
import { userCriteria } from './user.criteria';

@Injectable()
export class UserService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(usercriteria:userCriteria): Promise<User | null> {
        return this.userRepository.findOneBy(usercriteria);
    }

    async insertOne(userdto : userDto){
        // user.entity's creation
        let UserObject : User = new User();

        // sending data from DTO to Entity
        UserObject.nom = userdto.nom ;
        UserObject.prenom = userdto.prenom ;
        UserObject.email = userdto.email ;
        UserObject.telephone = userdto.telephone;
        UserObject.telephone = userdto.telephone;
        UserObject.mot_passe = bcrypt.hashSync(userdto.mot_de_passe, 10);
        UserObject.id_pays = userdto.id_pays;
        UserObject.monnaie = userdto.monnaie;
        UserObject.date_naissance = userdto.date_naissance;
        UserObject.profession = userdto.profession;
        UserObject.ville = userdto.ville;
        UserObject.statut = "/";
        //UserObject.photo = userdto.photo;

        // insertion of entity
        await this.userRepository.insert(UserObject);
        
    }

    async remove(telephone: number): Promise<void> {
        await this.userRepository.delete(telephone);
    }


}





@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);  
}



