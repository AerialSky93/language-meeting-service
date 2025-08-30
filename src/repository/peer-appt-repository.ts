import pool from '../config/database';
import type {
  PeerApptGetRequest,
  PeerApptGetResponse,
  PeerApptCreateRequest,
  PeerApptCreateResponse,
  PeerApptUpdateRequest,
  PeerApptUpdateResponse,
  PeerApptSearchRequest,
} from '../dto';

export class PeerApptRepository {
  async createPeerAppt(
    req: PeerApptCreateRequest,
  ): Promise<PeerApptCreateResponse> {
    const values = [
      req.conversation_topic_id,
      req.language_global_id,
      req.user_account_requestor_id,
      req.peer_appt_description,
      req.peer_appt_minute_duration,
      req.peer_appt_start_datetime,
      req.peer_appt_max_people,
      req.peer_appt_location,
    ];
    const query = `
      INSERT INTO peer_appt (
        conversation_topic_id, 
        language_global_id, 
        user_account_requestor_id,
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
        pa.peer_appt_id,
        pa.conversation_topic_id,
        ct.conversation_topic_name,
        pa.language_global_id,
        lg.language_name,
        pa.user_account_requestor_id,
        pa.peer_appt_description,
        pa.peer_appt_minute_duration,
        pa.peer_appt_start_datetime,
        pa.peer_appt_end_datetime,
        pa.peer_appt_max_people,
        pa.peer_appt_location
      FROM peer_appt pa
      LEFT JOIN conversation_topic ct ON pa.conversation_topic_id = ct.conversation_topic_id
      LEFT JOIN language_global lg ON pa.language_global_id = lg.language_global_id
      WHERE pa.peer_appt_id = $1;
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
        conversation_topic_id = $1,
        language_global_id = $2,
        user_account_requestor_id = $3,
        peer_appt_description = $4,
        peer_appt_minute_duration = $5,
        peer_appt_start_datetime = $6,
        peer_appt_max_people = $7,
        peer_appt_location = $8
      WHERE peer_appt_id = $9
      RETURNING peer_appt_id;
    `;

    const values = [
      req.conversation_topic_id,
      req.language_global_id,
      req.user_account_requestor_id,
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

  async searchPeerApptsByTopicAndLanguage(
    req: PeerApptSearchRequest,
  ): Promise<PeerApptGetResponse[]> {
    const query = `
      SELECT 
        pa.peer_appt_id,
        pa.conversation_topic_id,
        ct.conversation_topic_name,
        pa.language_global_id,
        lg.language_name,
        pa.user_account_requestor_id,
        pa.peer_appt_description,
        pa.peer_appt_minute_duration,
        pa.peer_appt_start_datetime,
        pa.peer_appt_end_datetime,
        pa.peer_appt_max_people,
        pa.peer_appt_location
      FROM peer_appt pa
      LEFT JOIN conversation_topic ct ON pa.conversation_topic_id = ct.conversation_topic_id
      LEFT JOIN language_global lg ON pa.language_global_id = lg.language_global_id
      WHERE pa.conversation_topic_id = $1 AND pa.language_global_id = $2
      ORDER BY pa.peer_appt_start_datetime ASC;
    `;
    const { rows } = await pool.query(query, [
      req.conversation_topic_id,
      req.language_global_id,
    ]);
    return rows;
  }
}
