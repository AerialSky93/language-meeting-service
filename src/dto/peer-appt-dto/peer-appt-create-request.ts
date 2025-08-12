import { IsString, IsNotEmpty, IsNumber, IsOptional, IsIn, IsInt, Min, Max, IsDateString, IsUUID } from 'class-validator';

export class PeerApptCreateRequest {
  @IsString()
  @IsNotEmpty({ message: 'Topic is required' })
  topic: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Language global ID is required' })
  language_global_id: number;

  @IsUUID()
  @IsNotEmpty({ message: 'Customer ID requestor is required' })
  customer_id_requestor: string;

  @IsString()
  @IsOptional()
  peer_appt_description?: string;

  @IsInt()
  @IsIn([15, 30, 45, 60], { message: 'Duration must be 15, 30, 45, or 60 minutes' })
  peer_appt_minute_duration: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Start datetime is required' })
  peer_appt_start_datetime: string;

  @IsInt()
  @Min(1, { message: 'Maximum people must be at least 1' })
  @Max(4, { message: 'Maximum people cannot exceed 4' })
  peer_appt_max_people: number;

  @IsString()
  @IsOptional()
  peer_appt_location?: string;
}
