import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAccountController } from './controller/user-account-controller';
import { UserAccountService } from './service/user-account-service';
import { UserAccountRepository } from './repository/user-account-repository';
import { PeerApptController } from './controller/peer-appt-controller';
import { PeerApptService } from './service/peer-appt-service';
import { PeerApptRepository } from './repository/peer-appt-repository';
import { DiscordService } from './service/discord-service';
import { AuthController } from './service-auth/auth-controller-google';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserAccountController,
    PeerApptController,
    AuthController,
  ],
  providers: [
    AppService,
    UserAccountService,
    UserAccountRepository,
    PeerApptService,
    PeerApptRepository,
    DiscordService,
  ],
  exports: [DiscordService],
})
export class AppModule {}
