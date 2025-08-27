import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserAccountCreateRequest {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Time zone is required' })
  time_zone: string;
}
