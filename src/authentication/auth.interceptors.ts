import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

const JWT_SIGN_SECRET = 'bliaeue15zpq1xz7saa97saszdeeeoc1187ed9z39j7o1z8zex'



export interface Response<T> {
  data: T;
}

@Injectable()
export class AuthInterceptor<T> implements NestInterceptor<T, Response<T>> {
    constructor(private jwtService: JwtService) {}
    
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    let req = context.switchToHttp().getRequest();
    
    this.tokenVerification(req.body.token).then((data) =>  {
      req.body.id_user = data.id;
    }).catch((reason)=>{
      console.log("Authentication error . Invalid token !",reason);
    });


    return next.handle().pipe(map(data => ({ data })));
  }

  tokenVerification(token : string):Promise<any>{
    /*let options : JwtVerifyOptions;
    options.secret = JWT_SIGN_SECRET;
    let metaData : any = this.jwtService.verifyAsync(token, options);
    return metaData;*/
    try {
      const options: JwtVerifyOptions = {
          secret: JWT_SIGN_SECRET,
      };
      
      const metaData: any = this.jwtService.verifyAsync(token, options);
      return metaData;
    } catch (error) {
      // Gérer les erreurs de vérification du jeton ici
      
      throw error;
    }

  }
}