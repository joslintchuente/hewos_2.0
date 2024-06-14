
import { IsOptional,IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';
import { IsCustomDateFormat } from 'src/validation/CustomDateFormat';

export class userDto3{

    @IsInt()
    id_user: number;
    
    @IsString()
    @IsNotEmpty()
    token : string;

    @IsNotEmpty()
    photo: any;

}