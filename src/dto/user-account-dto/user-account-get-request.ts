import { IsNumber, IsPositive, IsInt } from 'class-validator';

export class UserAccountGetRequest {
  @IsNumber()
  @IsPositive({ message: 'User ID must be a positive number' })
  @IsInt({ message: 'User ID must be an integer' })
  userId: number;
}
