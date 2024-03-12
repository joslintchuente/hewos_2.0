import { Controller, Get, Post, Req, Res, HttpStatus, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { OtpService } from './otp/otp.service';
import { CronTime } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { userDto } from './user/userDto';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AuthService } from './authentication/auth.service';
import { userLoginDto } from './user/userLoginDto';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private otpService : OtpService,
    private userService : UserService,
    private authService : AuthService,
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

  @Post('login')
  signIn(@Body(new ValidationPipe()) userLogin:userLoginDto, @Res() res : Response){
      
    let result = this.authService.signIn(userLogin.telephone,userLogin.mot_de_passe);
    result.then((userData)=>{
      res.status(HttpStatus.FOUND).json({
          reponse: true,
          id_pays: userData.result.id_pays,
          telephone: userData.result.telephone,
          token: userData.access_token,
          message: "Connexion reussie !",
      });
    }).catch((e)=>{
      res.status(HttpStatus.NOT_FOUND).json({
        reponse: false,
        error: "Mot de passe errone ou compte non existant !"+e
      });
    });
    
  }


  @Post('user')
  async signUp(@Body(new ValidationPipe()) user:userDto, @Res() res : Response){
    // verification of user existence
    let response = await this.authService.signUp(user.telephone);
    // user registration
    if(response == true){
      this.userService.insertOne(user).then(()=>{
        this.authService.generateToken(user.telephone).then((token)=>{
          res.status(HttpStatus.OK).json({
              reponse: true,
              id_pays: user.id_pays,
              telephone: user.telephone,
              token: token,
              message: "Inscription reussie !",
          });
        }).catch((e)=>{
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            reponse: false,
            message: "Probleme de gestion des tokens . Veuillez reessayer plutard ! "+e
          });
        });
      }).catch((e)=>{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          reponse: false,
          message: " Une erreur s'est produite lors de la creation du compte , reessayer plutard !"+e
        });
      });
    }else{
      res.status(HttpStatus.NOT_ACCEPTABLE).json({
        reponse: false,
        message: " Compte deja existant utilisant ces identifiants !"
      });
    }
    
  }
}
