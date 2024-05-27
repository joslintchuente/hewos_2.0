
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class commentaireDto{

    @IsInt()
    id_user: number;

    @IsNumberString()
    id_offre: number;

    @IsString()
    @IsNotEmpty()
    token : string;

    @IsString()
    @IsNotEmpty()
    avis: string;

}