import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class PeerApptCreateRequest {
  @IsNumber()
  @IsInt()
  @IsNotEmpty({ message: 'Conversation topic ID is required' })
  conversation_topic_id: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Language global ID is required' })
  language_global_id: number;

  @IsUUID()
  @IsNotEmpty({ message: 'User ID requestor is required' })
  user_account_requestor_id: string;

  @IsString()
  @IsOptional()
  peer_appt_description?: string;

  @IsInt()
  @IsNotEmpty({ message: 'Minute duration is required' })
  @IsIn([15, 30, 45, 60], {
    message: 'Duration must be 15, 30, 45, or 60 minutes',
  })
  peer_appt_minute_duration: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Start datetime is required' })
  peer_appt_start_datetime: string;

  @IsInt()
  @IsNotEmpty({ message: 'Maximum people is required' })
  @Min(1, { message: 'Maximum people must be at least 1' })
  @Max(4, { message: 'Maximum people cannot exceed 4' })
  peer_appt_max_people: number;

  @IsString()
  @IsOptional()
  peer_appt_location?: string;
}
