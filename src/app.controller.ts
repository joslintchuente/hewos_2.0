import { Controller, Get, Req, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { OtpService } from './otp/otp.service';
import { CronTime } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private otpService : OtpService,
    private schedulerRegistry: SchedulerRegistry) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('otp_code')
  opt_gen(@Req() request: Request, @Res() res : Response){

    if(request.body.numero.length  === 9){
      let code_otp = this.appService.generateOTP();
      OtpService.set_current_otp(parseInt(code_otp));
      this.otpService.insertOne(parseInt(code_otp));
      const job = this.schedulerRegistry.getCronJob('otp_desactivation');
      

      try{
        job.start();
      }catch(e){
        const cronTime = new CronTime(new Date(Date.now() + 10 * 1 * 1000));
        job.setTime(cronTime);
        //this.schedulerRegistry.addTimeout('otp_desactivation',new Date(Date.now() + 10 * 1 * 1000) );
        job.start();
      }
      
      
      console.log('minuterie pour de 5 min ');
      res.status(HttpStatus.OK).json({
        code_otp : parseInt(code_otp)
      })
    }else{
      res.status(HttpStatus.NOT_ACCEPTABLE).json({
        error: "Le numero doit etre a 9 chiffres"
      })
    }
    
  }

  @Get('valid_otp_code')
  otp_verification(@Req() request: Request, @Res() res : Response){
    this.otpService.findOne(parseInt(request.body.otp)).then((otp_ent)=>{
      if(otp_ent.isActive == 1){
        res.status(HttpStatus.OK).json({
          Verified : 1
        });
      }else{
        res.status(HttpStatus.NOT_ACCEPTABLE).json({
          message: 'code OTP erronne'
        });
      }
    }).catch((error)=>{
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "une erreur est survenue lors de l'opération ! ::" + error,
      });
    })
  }
}
