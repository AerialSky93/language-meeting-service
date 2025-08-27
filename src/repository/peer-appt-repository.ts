import pool from '../config/database';
import type {
  PeerApptGetRequest,
  PeerApptGetResponse,
  PeerApptCreateRequest,
  PeerApptCreateResponse,
  PeerApptUpdateRequest,
  PeerApptUpdateResponse,
} from '../dto';

export class PeerApptRepository {
  async createPeerAppt(
    req: PeerApptCreateRequest,
  ): Promise<PeerApptCreateResponse> {
    const values = [
      req.topic,
      req.language_global_id,
      req.user_account_id_requestor,
      req.peer_appt_description,
      req.peer_appt_minute_duration,
      req.peer_appt_start_datetime,
      req.peer_appt_max_people,
      req.peer_appt_location,
    ];
    const query = `
      INSERT INTO peer_appt (
        topic, 
        language_global_id, 
        user_account_id_requestor,
        peer_appt_description, 
        peer_appt_minute_duration, 
        peer_appt_start_datetime, 
        peer_appt_max_people, 
        peer_appt_location
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING peer_appt_id;
    `;

    const {
      rows: [{ peer_appt_id }],
    } = await pool.query(query, values);
    return { peer_appt_id };
  }

  async getPeerApptById({
    peer_appt_id,
  }: PeerApptGetRequest): Promise<PeerApptGetResponse | null> {
    const query = `
      SELECT 
        peer_appt_id,
        topic,
        language_global_id,
        user_account_id_requestor,
        peer_appt_description,
        peer_appt_minute_duration,
        peer_appt_start_datetime,
        peer_appt_end_datetime,
        peer_appt_max_people,
        peer_appt_location
      FROM peer_appt
      WHERE peer_appt_id = $1;
    `;
    const { rows } = await pool.query(query, [peer_appt_id]);
    return rows[0] || null;
  }

  async updatePeerAppt(
    req: PeerApptUpdateRequest,
  ): Promise<PeerApptUpdateResponse | null> {
    const query = `
      UPDATE peer_appt 
      SET 
        topic = $1,
        language_global_id = $2,
        user_account_id_requestor = $3,
        peer_appt_description = $4,
        peer_appt_minute_duration = $5,
        peer_appt_start_datetime = $6,
        peer_appt_max_people = $7,
        peer_appt_location = $8
      WHERE peer_appt_id = $9
      RETURNING peer_appt_id;
    `;

    const values = [
      req.topic,
      req.language_global_id,
      req.user_account_id_requestor,
      req.peer_appt_description,
      req.peer_appt_minute_duration,
      req.peer_appt_start_datetime,
      req.peer_appt_max_people,
      req.peer_appt_location,
      req.peer_appt_id,
    ];

    const { rows } = await pool.query(query, values);
    return rows.length
      ? { message: 'Peer appointment updated successfully' }
      : null;
  }
}
