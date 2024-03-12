
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class userLoginDto{

    @IsPhoneNumber('CM')
    @IsNotEmpty()
    telephone: number;

    @IsString()
    @IsNotEmpty()
    mot_de_passe:string;

    @IsNumberString()
    @MaxLength(3)
    @IsNotEmpty()
    id_pays: number;
    

    


}