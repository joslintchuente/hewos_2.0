
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';

export class postulatDto{

    @IsInt()
    id_user: number;

    @IsNumberString()
    id_offre: number;

    @IsString()
    @IsNotEmpty()
    token : string;

    @IsString()
    @IsNotEmpty()
    reponses ?: string;

}