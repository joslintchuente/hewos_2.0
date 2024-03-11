import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  generateOTP(): string {
    
    let otp = '';

    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
  }
}
