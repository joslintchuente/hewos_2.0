
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class commentaireDto2{

    @IsNumberString()
    @IsNotEmpty()
    id_offre: number;

    @IsString()
    @IsNotEmpty()
    token : string;

}