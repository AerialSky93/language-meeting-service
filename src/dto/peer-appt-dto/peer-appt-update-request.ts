import {
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class PeerApptUpdateRequest {
  @IsUUID()
  peer_appt_id?: string;

  @IsString()
  topic?: string;

  @IsNumber()
  language_global_id?: number;

  @IsUUID()
  user_account_id_requestor?: string;

  @IsString()
  peer_appt_description?: string;

  @IsInt()
  @IsIn([15, 30, 45, 60], {
    message: 'Duration must be 15, 30, 45, or 60 minutes',
  })
  peer_appt_minute_duration?: number;

  @IsDateString()
  peer_appt_start_datetime?: string;

  @IsInt()
  @Min(1, { message: 'Maximum people must be at least 1' })
  @Max(4, { message: 'Maximum people cannot exceed 4' })
  peer_appt_max_people?: number;

  @IsString()
  peer_appt_location?: string;
}
