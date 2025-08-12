import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './controller/customer-controller';
import { CustomerService } from './service/customer-service';
import { CustomerRepository } from './repository/customer-repository';
import { PeerApptController } from './controller/peer-appt-controller';
import { PeerApptService } from './service/peer-appt-service';
import { PeerApptRepository } from './repository/peer-appt-repository';
import { DiscordService } from './service/discord-service';

@Module({ 
  imports: [],
  controllers: [AppController, CustomerController, PeerApptController],
  providers: [AppService, CustomerService, CustomerRepository, PeerApptService, PeerApptRepository, DiscordService],
  exports: [DiscordService],
})
export class AppModule {}
