import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppController } from '../app.controller';
import { UserModule } from '../user/user.module';
import { AuthInterceptor } from './auth.interceptors';

@Module({
  imports: [UserModule],
  providers: [AuthService,AuthInterceptor],
  controllers: [AppController],
})
export class AuthModule {}