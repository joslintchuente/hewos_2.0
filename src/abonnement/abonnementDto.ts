
import { IsString, IsInt , IsPhoneNumber, IsEmail, IsStrongPassword, MaxLength, MinLength, IsDate, IsNotEmpty, IsNumberString, IsDateString } from 'class-validator';

export class abonnementDto{

    @IsInt()
    id_user: number;

    @IsNumberString()
    follower_id: number;

    @IsString()
    @IsNotEmpty()
    token : string;


}