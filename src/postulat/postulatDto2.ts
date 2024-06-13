
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';

export class postulatDto2{

    @IsInt()
    id_user: number;

    @IsNumberString()
    id_offre: number;

    @IsString()
    @IsNotEmpty()
    token : string;


}