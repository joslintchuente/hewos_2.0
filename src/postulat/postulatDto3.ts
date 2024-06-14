
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';

export class postulatDto3{

    @IsInt()
    id_user: number;

    @IsNumberString()
    @IsNotEmpty()
    id_offre: string;

    @IsNumberString()
    @IsNotEmpty()
    id_postulant: string;

    @IsString()
    @IsNotEmpty()
    token : string;


}