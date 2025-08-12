export interface PeerApptGetResponse {
  peer_appt_id: string;
  topic: string;
  language_global_id: number;
  customer_id_requestor: string;
  peer_appt_description: string | null;
  peer_appt_minute_duration: number;
  peer_appt_start_datetime: string;
  peer_appt_end_datetime: string;
  peer_appt_max_people: number;
  peer_appt_location: string | null;
}
