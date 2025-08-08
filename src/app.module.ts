import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './controller/customer-controller';
import { CustomerService } from './service/customer-service';
import { CustomerRepository } from './repository/customer-repository';

@Module({ 
  imports: [],
  controllers: [AppController, CustomerController],
  providers: [AppService, CustomerService, CustomerRepository],
})
export class AppModule {}
