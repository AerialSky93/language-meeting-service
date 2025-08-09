import pool from "../config/database";
import type {
  CustomerGetRequest,
  CustomerGetResponse,
  CustomerCreateRequest,
  CustomerCreateResponse,
  CustomerUpdateRequest,
  CustomerUpdateResponse,
} from "../dto";

export class CustomerRepository {
  async createCustomer(
    req: CustomerCreateRequest
  ): Promise<CustomerCreateResponse> {
    const values = [req.first_name, req.last_name, req.email, req.time_zone];
    const query = `
            INSERT INTO customer (first_name, last_name, email, time_zone)
            VALUES ($1, $2, $3, $4)
            RETURNING customer_id;
        `;

    const {
      rows: [{ customer_id }],
    } = await pool.query(query, values);
    return { customerId: customer_id };
  }

  async getCustomerById({
    customerId,
  }: CustomerGetRequest): Promise<CustomerGetResponse | null> {
    const query = `
          SELECT customer_id, first_name, last_name, email, time_zone
          FROM customer
          WHERE customer_id = $1;
        `;
    const { rows } = await pool.query(query, [customerId]);
    return rows[0] || null;
  }

  async updateCustomer(
    customerId: number,
    req: CustomerUpdateRequest
  ): Promise<CustomerUpdateResponse | null> {
    const query = `
          UPDATE customer 
          SET first_name = COALESCE($1, first_name),
              last_name = COALESCE($2, last_name),
              email = COALESCE($3, email),
              time_zone = COALESCE($4, time_zone)
          WHERE customer_id = $5
          RETURNING customer_id;
        `;
    const values = [req.first_name, req.last_name, req.email, req.time_zone, customerId];
    const { rows } = await pool.query(query, values);

    return rows.length ? { message: "Customer updated successfully" } : null;
  }


}

