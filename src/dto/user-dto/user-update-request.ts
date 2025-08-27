import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UserUpdateRequest {
  @IsString()
  first_name?: string;

  @IsString()
  last_name?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsString()
  time_zone?: string;
}
