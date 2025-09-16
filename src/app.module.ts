import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountController } from './controller/user-account-controller';
import { UserAccountService } from './service/user-account-service';
import { UserAccountRepository } from './repository/user-account-repository';
import { PeerApptController } from './controller/peer-appt-controller';
import { PeerApptService } from './service/peer-appt-service';
import { PeerApptRepository } from './repository/peer-appt-repository';
import { DiscordService } from './service/discord-service';
import { DiscordController } from './controller/discord-controller';
import { AuthController } from './service-auth/auth-controller-google';
import { PassportService } from './service-auth/passport';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [
    AppController,
    UserAccountController,
    PeerApptController,
    DiscordController,
    AuthController,
  ],
  providers: [
    AppService,
    UserAccountService,
    UserAccountRepository,
    PassportService,
    PeerApptService,
    PeerApptRepository,
    DiscordService,
  ],
  exports: [DiscordService],
})
export class AppModule {}
