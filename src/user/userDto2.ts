
import {IsOptional, IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class userDto2{

    @IsInt()
    id_user: number;
    
    @IsString()
    @IsNotEmpty()
    token : string;

    @IsOptional()
    @IsString()
    nom?: string;

    @IsOptional()
    @IsString()
    prenom?: string;

    @IsPhoneNumber('CM')
    @IsOptional()
    telephone?: number;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNumberString()
    @IsOptional()
    @MaxLength(3)
    id_pays?: number;
    
    @IsString()
    @MaxLength(3)
    @IsOptional()
    monnaie?: string;
    
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsOptional()
    profession?: string;

    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @IsOptional()
    ville?: string;

    @IsCustomDateFormat()
    @IsOptional()
    date_naissance?: Date;


}