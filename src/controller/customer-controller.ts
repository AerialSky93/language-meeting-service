import { Controller, Get, Post, Put, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { CustomerService } from "../service/customer-service";
import { CustomerGetRequest } from "../dto/customer-dto/customer-get-request";
import { CustomerCreateRequest } from "../dto/customer-dto/customer-create-request";
import { CustomerUpdateRequest } from "../dto/customer-dto/customer-update-request";
import { CustomerCreateResponse } from "../dto/customer-dto/customer-create-response";
import { CustomerGetResponse } from "../dto/customer-dto/customer-get-response";
import { CustomerUpdateResponse } from "../dto/customer-dto/customer-update-response";

@Controller()
export class CustomerController {

  constructor(private readonly customerService: CustomerService) {}

  @Post('customer')
  async createCustomer(@Body() createCustomerDto: CustomerCreateRequest): Promise<CustomerCreateResponse> {
    try {
      const result = await this.customerService.createCustomer(createCustomerDto);
      return result;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("Missing") 
        ? StatusCodes.BAD_REQUEST 
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }
  
  @Get('customer/:id')
  async getCustomerById(@Param('id') id: string): Promise<CustomerGetResponse> {
    try {
      const customerId = parseInt(id);
      const request: CustomerGetRequest = {
        customerId: customerId,
      };

      const customer = await this.customerService.getCustomerById(request);
      return customer;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }

  @Put('customer/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: CustomerUpdateRequest
  ): Promise<CustomerUpdateResponse> {
    try {
      const customerId = parseInt(id);
      const customer = await this.customerService.updateCustomer(
        customerId,
        updateCustomerDto
      );
      return customer;
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes("not found")
        ? StatusCodes.NOT_FOUND
        : StatusCodes.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        error instanceof Error ? error.message : "An error occurred",
        statusCode
      );
    }
  }


}

