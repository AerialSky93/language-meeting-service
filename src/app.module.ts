import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './controller/user-controller';
import { UserService } from './service/user-service';
import { UserRepository } from './repository/user-repository';
import { PeerApptController } from './controller/peer-appt-controller';
import { PeerApptService } from './service/peer-appt-service';
import { PeerApptRepository } from './repository/peer-appt-repository';
import { DiscordService } from './service/discord-service';

@Module({
  imports: [],
  controllers: [AppController, UserController, PeerApptController],
  providers: [
    AppService,
    UserService,
    UserRepository,
    PeerApptService,
    PeerApptRepository,
    DiscordService,
  ],
  exports: [DiscordService],
})
export class AppModule {}
