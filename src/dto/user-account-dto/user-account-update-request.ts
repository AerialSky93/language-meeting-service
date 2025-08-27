import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserAccountUpdateRequest {
  @IsString()
  full_name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsString()
  time_zone?: string;
}
