import { Injectable,  Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OTP } from './otp.entity';
import { Cron } from '@nestjs/schedule';
import { error } from 'console';
import { SchedulerRegistry } from '@nestjs/schedule';
import { resolve } from 'path';

@Injectable()
export class OtpService {
    private readonly logger = new Logger(TasksService.name);
    private static current_otp : number;
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  findAll(): Promise<OTP[]> {
    return this.otpRepository.find();
  }

  findOne(code: number): Promise<OTP | null> {
    return this.otpRepository.findOneBy({ code });
  }

  insertOne(code: number){
    let Otp_code : OTP = new OTP();
    Otp_code.code = code;
    Otp_code.date = new Date();
    console.log(Otp_code);
    this.otpRepository.insert(Otp_code);
    
  }

  async remove(id: number): Promise<void> {
    await this.otpRepository.delete(id);
  }


  @Cron(new Date(Date.now() + 1 * 10 * 1000), {
    name: 'otp_desactivation',
    disabled:true,
  })
  async desactivate() {
    const Otp_code = {
        isActive : 0,
    };
    
    let criteria = {
        code: OtpService.current_otp,
    };

    await this.otpRepository.update(criteria,Otp_code).then(()=>{
        console.log('Mise en Jour OTP reussie !');
        
    }).catch((error)=>{
        console.error(error);
    });
    this.logger.debug('Annulation de la validite du code OTP! ');
    
  }

  static set_current_otp(otp: number){
    this.current_otp = otp;
  }
}





@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  
}