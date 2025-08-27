import pool from "../config/database";
import type {
  UserGetRequest,
  UserGetResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from "../dto";

export class UserRepository {
  async createUser(
    req: UserCreateRequest
  ): Promise<UserCreateResponse> {
    const values = [req.first_name, req.last_name, req.email, req.time_zone];
    const query = `
            INSERT INTO users (first_name, last_name, email, time_zone)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id;
        `;

    const {
      rows: [{ user_id }],
    } = await pool.query(query, values);
    return { userId: user_id };
  }

  async getUserById({
    userId,
  }: UserGetRequest): Promise<UserGetResponse | null> {
    const query = `
          SELECT user_id, first_name, last_name, email, time_zone
          FROM users
          WHERE user_id = $1;
        `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0] || null;
  }

  async updateUser(
    userId: number,
    req: UserUpdateRequest
  ): Promise<UserUpdateResponse | null> {
    const query = `
          UPDATE users 
          SET first_name = COALESCE($1, first_name),
              last_name = COALESCE($2, last_name),
              email = COALESCE($3, email),
              time_zone = COALESCE($4, time_zone)
          WHERE user_id = $5
          RETURNING user_id;
        `;
    const values = [req.first_name, req.last_name, req.email, req.time_zone, userId];
    const { rows } = await pool.query(query, values);

    return rows.length ? { message: "User updated successfully" } : null;
  }

  async getOrCreateUser(
    socialUserId: string,
    name: string,
    registrationType: 'google' | 'facebook' | 'email',
    email?: string
  ): Promise<UserGetResponse> {
    // First try to find existing user by social_user_id
    const findQuery = `
      SELECT user_id, first_name, last_name, email, time_zone
      FROM users
      WHERE social_user_id = $1;
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
      INSERT INTO users (first_name, last_name, email, social_user_id, registration_type, time_zone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, first_name, last_name, email, time_zone;
    `;
    
    const { rows: newUser } = await pool.query(createQuery, [
      firstName,
      lastName,
      email || '',
      socialUserId,
      registrationType,
      'UTC' // default timezone
    ]);
    
    return newUser[0];
  }
}
