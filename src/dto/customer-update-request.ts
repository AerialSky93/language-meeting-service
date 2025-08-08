import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CustomerUpdateRequest {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
}
