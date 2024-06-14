
import { Body,Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { userDto } from './userDto';
import * as bcrypt from 'bcrypt';
import { userCriteria } from './user.criteria';
import { userDto2 } from './userDto2';
import * as fs from 'node:fs/promises';
import * as path from 'path';

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

    async update(userdto : userDto2){
        return await this.userRepository.update(userdto.id_user,
            {
                nom : userdto.nom,
                prenom: userdto.prenom,
                telephone:userdto.telephone,
                email: userdto.email,
                id_pays:userdto.id_pays ,
                monnaie: userdto.monnaie,
                profession:userdto.profession,
                ville: userdto.ville,
                date_naissance:userdto.ville
            });
    }

    async update_image(@Body() body :any, photo: Express.Multer.File){
        return await this.userRepository.update(body.id_user,
            {
                photo:photo.filename
            });
    }

    async storage_image(file: Express.Multer.File, id_user: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.mkdir('public/images/user/user_' + id_user).catch((e)=>{
                if (e.code !== "EEXIST") throw e;
            });
            fs.mkdir('public/images/user/user_' + id_user + '/profil').then(()=>{
                const cheminDestination = path.join('public/images/user/user_' + id_user + '/profil', file.filename);
        
                // Déplacer le fichier vers le dossier de destination
                fs.cp(file.path, cheminDestination).then(() => {
                    fs.rm(file.path);
                    resolve(cheminDestination);
                }).catch((error) => {
                    reject(`Erreur lors du déplacement du fichier : ${error}`);
                });

            }).catch((e)=>{
                if (e.code == "EEXIST") {

                    const cheminDestination = path.join('public/images/user/user_' + id_user + '/profil', file.filename);
                    // Déplacer le fichier vers le dossier de destination
                    fs.cp(file.path, cheminDestination).then(() => {
                        fs.rm(file.path);
                        resolve(cheminDestination);
                    }).catch((error) => {
                        reject(`Erreur lors du déplacement du fichier : ${error}`);
                    });

                }else{
                    reject(`Erreur lors de la création du dossier de destination : ${e}`);
                }
            });  
        });
    }


}





@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);  
}



