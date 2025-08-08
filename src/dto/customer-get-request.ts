import { IsNumber, IsPositive, IsInt } from 'class-validator';

export class CustomerGetRequest {
  @IsNumber()
  @IsPositive({ message: 'Customer ID must be a positive number' })
  @IsInt({ message: 'Customer ID must be an integer' })
  customerId: number;
}
