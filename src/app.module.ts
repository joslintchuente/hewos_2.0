import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OtpModule } from './otp/otp.module'; 
import { OTP } from './otp/otp.entity';
import { OtpService } from './otp/otp.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthService } from './authentication/auth.service';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port:  parseInt(process.env.PORT) ,
      username: 'root',
      password: process.env.PASSWORD,
      database: 'hewos',
      entities: [OTP,User],
      synchronize: Boolean(process.env.SYNCHRONIZE_DEV),
      
    }), OtpModule , ScheduleModule.forRoot(),UserModule
  ],
  controllers: [AppController],
  providers: [AppService,OtpService,AuthService,UserModule,UserService,JwtService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
