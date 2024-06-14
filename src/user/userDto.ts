
import { IsOptional,IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class userDto{

    @IsString()
    @IsNotEmpty()
    nom : string;

    @IsString()
    @IsNotEmpty()
    prenom: string;

    @IsPhoneNumber('CM')
    @IsNotEmpty()
    telephone: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    mot_de_passe:string;

    @IsStrongPassword()
    repeat_mot_de_passe: string;

    @IsNumberString()
    @MaxLength(3)
    @IsNotEmpty()
    id_pays: number;
    
    @IsString()
    @MaxLength(3)
    @IsNotEmpty()
    monnaie: string;
    
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsNotEmpty()
    profession: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsNotEmpty()
    ville: string;

    @IsCustomDateFormat()
    @IsNotEmpty()
    date_naissance: Date;


    @IsOptional()
    photo?: any;

}