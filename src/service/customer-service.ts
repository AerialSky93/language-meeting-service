import { CustomerRepository } from "../repository/customer-repository";
import type { CustomerGetRequest } from "../dto/customer-get-request";
import type { CustomerGetResponse } from "../dto/customer-get-response";
import type { CustomerCreateRequest } from "../dto/customer-create-request";
import type { CustomerCreateResponse } from "../dto/customer-create-response";
import type { CustomerUpdateRequest } from "../dto/customer-update-request";
import type { CustomerUpdateResponse } from "../dto/customer-update-response";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async createCustomer(
    customerData: CustomerCreateRequest
  ): Promise<CustomerCreateResponse> {
    try {
      return await this.customerRepository.createCustomer(customerData);
    } catch (error) {
      throw new Error(
        `Failed to create customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getCustomerById(
    request: CustomerGetRequest
  ): Promise<CustomerGetResponse> {
    const customer = await this.customerRepository.getCustomerById(request);
    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  async updateCustomer(
    customerId: number,
    request: CustomerUpdateRequest
  ): Promise<CustomerUpdateResponse> {
    if (!request.first_name && !request.last_name && !request.email) {
      throw new Error("At least one field must be provided for update");
    }

    const customer = await this.customerRepository.updateCustomer(
      customerId,
      request
    );
    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }


}

