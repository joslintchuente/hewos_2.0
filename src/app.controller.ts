import { Controller, Get, Post, Req, Res, HttpStatus, Body, Sse, Next, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { OtpService } from './otp/otp.service';
import { CronTime } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { userDto } from './user/userDto';
import { userDto2 } from './user/userDto2';
import { ValidationPipe } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AuthService } from './authentication/auth.service';
import { OfferService } from './offer/offer.service';
import { QuestionService } from './question/question.service';
import { userLoginDto } from './user/userLoginDto';
import { offerDto } from './offer/offerDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthInterceptor } from './authentication/auth.interceptors';
import { diskStorage } from 'multer';
import { commentaireDto } from './commentaire/commentaireDto';
import { commentaireDto2 } from './commentaire/commentaireDto2';
import { CommentaireService } from './commentaire/commentaire.service';
import { postulatDto } from './postulat/postulatDto';
import { postulatDto2 } from './postulat/postulatDto2';
import { PostulatService } from './postulat/postulat.service';
import { abonnementDto } from './abonnement/abonnementDto';
import { AbonnementService } from './abonnement/abonnement.service';

@Controller('')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private otpService : OtpService,
    private userService : UserService,
    private authService : AuthService,
    private offerService : OfferService,
    private questionService : QuestionService,
    private commentaireService : CommentaireService,
    private postulatService : PostulatService,
    private abonnementService : AbonnementService,
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

  // Endpoint for publicate
  @Post('publier')
  @UseInterceptors(
    FileInterceptor('photo',{
      storage : diskStorage({
        destination : function (req, file, cb) {
          cb(null, './public/images/temp')
        },
        filename : (req,file,cb) => {
          cb(null, ''+Date.now()+'_'+file.originalname)
        }
      })
    }),
    AuthInterceptor
  )
  async publicate(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe()) offer:offerDto, @Res() res : Response ){

    try{
      
      this.offerService.insertOne(offer,file).then((query)=>{
        
        if(offer.mode === "question"){
          let questions : string[] = offer.questions.split("*");
          questions.forEach(element => {
            
            this.questionService.insertOne(element,query.identifiers[0].id_offre).catch((e)=>{
              console.error(e);
              res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message : 'Erreur lors de prise des questions :' + e
              });
            });
          });
        }
        this.offerService.stockerFichier(file,offer.id_user,query.identifiers[0].id_offre).catch((e)=>{
          console.error(e);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message : 'Erreur lors de la reception des images :' + e
          });
        });


        res.status(HttpStatus.CREATED).json({
          message: "publication reussie !"
        });
      }).catch((e)=>{
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message : "Erreur lors de la publication : "+e
        });
      });
      

    }catch(e){
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        response : e
      });
    }
    

  }

/*
  TODO : 
      - afficher les publications
      - les trier (nombre limite de pub , algorithme de recommandation, Hazard , facteur anciennete  )
      - Envoie de notifications de publications, de messages, de postes , likes , commentaires , d'evenements*/
      /*
  
  @Sse('publications')
  @UseInterceptors(AuthInterceptor)
  sse(): Observable<MessageEvent> {
    let offServ = this.offerService;
    let selCri : SelectionCriteria; 
    const observable = new Observable(function subscribe(subscriber) {
      
      try {
        //listing of criteria to match
        //selCri.
        offServ.findOne();
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        subscriber.complete();
      } catch (err) {
        subscriber.error(err); // delivers an error if it caught one
      }
    });
  }*/
  
  @Get('publications')
  @UseInterceptors(AuthInterceptor)
  async send_publications(@Body(new ValidationPipe()) reqst, @Res() res : Response){
    let offServ = this.offerService;

    offServ.findMany(reqst).then((result)=>{
      res.status(HttpStatus.FOUND).json({
        data: result[0],
        message: 'Recuperation de '+ result[1] +' publications !'
      });

    }).catch((e)=>{
      console.error(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : 'Erreur lors de la recuperation des publications :' + e
      });
    });
  }

  @Put('likes_publications')
  @UseInterceptors(AuthInterceptor)
  async likes(@Body(new ValidationPipe()) reqst, @Res() res : Response){
    this.offerService.updateLikes(reqst).then((result)=>{
      res.status(HttpStatus.CREATED).json({
        message: "publication likee !"
      });
    }).catch((e)=>{
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur lors du like de la publication : "+e
      });
    });
  }

  @Post('commentaires')
  @UseInterceptors(AuthInterceptor)
  async commenter(@Body(new ValidationPipe()) body: commentaireDto, @Res() res : Response){
    
    this.commentaireService.insertOne(body).then((result)=>{
      res.status(HttpStatus.CREATED).json({
              message: "Commentaire envoye !"
            });
    }).catch((e)=>{
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur lors du commentaire de la publication : "+e
      });
    });
    
  }

  @Get('listes_commentaires')
  @UseInterceptors(AuthInterceptor)
  async get_comments(@Body(new ValidationPipe()) body: commentaireDto2, @Res() res : Response){
    this.commentaireService.findMany(body).then((result)=>{
      res.status(HttpStatus.FOUND).json({
        message: 'Recuperation de 7/'+ result[1] +' commentaires !',
        data: result[0],
        nbr_commentaires: result[1]
      });
    }).catch((e)=>{
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur de recuperation des commentaires : "+e
      });
    });
  }

  @Post('postulat')
  @UseInterceptors(AuthInterceptor)
  async postuler(@Body(new ValidationPipe()) body: postulatDto, @Res() res : Response){
    this.postulatService.insertOne(body).then((result)=>{
      res.status(HttpStatus.CREATED).json({
        message: 'postulat fait!'
      });
    }).catch((e)=>{
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur lors du postulat a cet offre : "+e
      });
    });
  }

  @Get('postulants')
  @UseInterceptors(AuthInterceptor)
  async lister_postulants(@Body(new ValidationPipe()) body: postulatDto2, @Res() res : Response){
    this.postulatService.findMany(body.id_offre).then((result)=>{
      res.status(HttpStatus.FOUND).json({
        message: 'Recuperation de '+ result[1] +' profil(s) de postulant(s) !',
        data: result[0],
        nbr_postulants: result[1]
      });
    }).catch((e)=>{
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur de recuperation des commentaires : "+e
      });
    });
  }

  @Post('souscrire')
  @UseInterceptors(AuthInterceptor)
  async abonner(@Body(new ValidationPipe()) body: abonnementDto, @Res() res : Response){
    this.abonnementService.insertOne(body).then((result)=>{
      res.status(HttpStatus.ACCEPTED).json({
        message: 'Abonnement reussi !'
      });
    }).catch((e)=>{
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Erreur lors de l'abonnement : "+e
      });
    });
  }    

  @Put('profil')
  @UseInterceptors(AuthInterceptor)
  async modifier_profil(@Body(new ValidationPipe()) body: userDto2, @Res() res : Response){
    this.userService.update(body).then(()=>{
      res.status(HttpStatus.ACCEPTED).json({
        message: 'Mis a jour du profil reussi !'
      });
    }).catch((e)=>{
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message : "Echec de mis a jour du profil : "+e
      });
    });
  }

}
