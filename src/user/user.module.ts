import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";
import { User } from "./user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [TypeOrmModule],
  })
  export class UserModule {}