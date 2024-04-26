
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class offerDto{

    @IsInt()
    id_user: number;

    @IsString()
    @IsNotEmpty()
    token : string;

    @IsString()
    @IsNotEmpty()
    prefixe: string;

    @IsString()
    @IsNotEmpty()
    intitule: string;
    
    @IsString()
    @IsNotEmpty()
    mode: string;
    
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    description: string;

    @IsCustomDateFormat()
    @IsNotEmpty()
    delai: Date;

    
    photo?: File;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    questions?: string; // formatted as : "question1*question2*question3*..."

}