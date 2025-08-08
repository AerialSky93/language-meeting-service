import { IsUUID } from 'class-validator';

export class PeerApptGetRequest {
  @IsUUID()
  peer_appt_id: string;
}
