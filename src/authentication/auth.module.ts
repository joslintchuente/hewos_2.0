import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppController } from '../app.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AppController],
})
export class AuthModule {}