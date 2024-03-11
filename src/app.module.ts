import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OtpModule } from './otp/otp.module'; 
import { OTP } from './otp/otp.entity';
import { OtpService } from './otp/otp.service';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port:  parseInt(process.env.PORT) ,
      username: 'root',
      password: process.env.PASSWORD,
      database: 'hewos',
      entities: [OTP],
      synchronize: Boolean(process.env.SYNCHRONIZE_DEV),
      
    }), OtpModule , ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService,OtpService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
