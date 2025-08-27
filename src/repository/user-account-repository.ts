import pool from '../config/database';
import type {
  UserAccountGetRequest,
  UserAccountGetResponse,
  UserAccountCreateRequest,
  UserAccountCreateResponse,
  UserAccountUpdateRequest,
  UserAccountUpdateResponse,
} from '../dto';

export class UserAccountRepository {
  async createUserAccount(
    req: UserAccountCreateRequest,
  ): Promise<UserAccountCreateResponse> {
    const values = [req.first_name, req.last_name, req.email, req.time_zone];
    const query = `
            INSERT INTO user_account (first_name, last_name, email, time_zone)
            VALUES ($1, $2, $3, $4)
            RETURNING user_account_id;
        `;

    const {
      rows: [{ user_account_id }],
    } = await pool.query(query, values);
    return { userId: user_account_id };
  }

  async getUserAccountById({
    userId,
  }: UserAccountGetRequest): Promise<UserAccountGetResponse | null> {
    const query = `
          SELECT user_account_id, first_name, last_name, email, time_zone
          FROM user_account
          WHERE user_account_id = $1;
        `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
  }

  async updateUserAccount(
    userId: number,
    req: UserAccountUpdateRequest,
  ): Promise<UserAccountUpdateResponse | null> {
    const query = `
          UPDATE user_account
          SET first_name = COALESCE($1, first_name),
              last_name = COALESCE($2, last_name),
              email = COALESCE($3, email),
              time_zone = COALESCE($4, time_zone)
          WHERE user_account_id = $5
          RETURNING user_account_id;
        `;
    const values = [
      req.first_name,
      req.last_name,
      req.email,
      req.time_zone,
      userId,
    ];
    const { rows } = await pool.query(query, values);

    return rows.length
      ? { message: 'User account updated successfully' }
      : null;
  }

  async getOrCreateUserAccount(
    socialUserId: string,
    name: string,
    registrationType: 'google' | 'facebook' | 'email',
    email?: string,
  ): Promise<UserAccountGetResponse> {
    // First try to find existing user by social_user_account_id
    const findQuery = `
      SELECT user_account_id, first_name, last_name, email, time_zone
      FROM user_account
      WHERE social_user_account_id = $1;
    `;

    const { rows } = await pool.query(findQuery, [socialUserId]);

    if (rows.length > 0) {
      // User exists, return it
      return rows[0];
    }

    // User doesn't exist, create new one
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const createQuery = `
      INSERT INTO user_account (first_name, last_name, email, social_user_account_id, registration_type, time_zone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_account_id, first_name, last_name, email, time_zone;
    `;

    const { rows: newUser } = await pool.query(createQuery, [
      firstName,
      lastName,
      email || '',
      socialUserId,
      registrationType,
      'UTC', // default timezone
    ]);

    return newUser[0];
  }
}
