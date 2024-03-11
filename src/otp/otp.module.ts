import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from './otp.service';
import { AppController } from '../app.controller';
import { OTP } from './otp.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OTP])],
  providers: [OtpService],
  exports: [TypeOrmModule],
})
export class OtpModule {}