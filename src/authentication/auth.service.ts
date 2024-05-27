import { Injectable, UnauthorizedException ,PreconditionFailedException, NestMiddleware} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'; 
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
const JWT_SIGN_SECRET = 'bliaeue15zpq1xz7saa97saszdeeeoc1187ed9z39j7o1z8zex'

@Injectable()
export class AuthService {

  constructor(private userService: UserService,private jwtService: JwtService) {}

  async signIn(telephone: number, pass: string): Promise<any> {
    const user = await this.userService.findOne({telephone:telephone});
    if (!bcrypt.compareSync(pass, user.mot_passe)) {
      throw new UnauthorizedException();
    }
    const { mot_passe, ...result } = user;
    const payload = { id: user.id_user, nom: user.nom };
    return {
        result : result,
      access_token: await this.jwtService.signAsync(payload,{expiresIn: '24h',privateKey: JWT_SIGN_SECRET}),
      
    };
  }

  // verification of user existence
  async signUp(telephone: number):Promise<Boolean>{
    const user = await this.userService.findOne({telephone:telephone});
    if(user){
        throw new PreconditionFailedException({message: "Precondition Failed , User already exist !"});
    }else{
        return true;
    }
  }

  async generateToken(telephone: number){
    const user = await this.userService.findOne({telephone:telephone});
    const { mot_passe, ...result } = user;
    const payload = { id: user.id_user, nom: user.nom };
    return await this.jwtService.signAsync(payload,{expiresIn: '24h',privateKey: JWT_SIGN_SECRET});
  }

  
  
  

  
}