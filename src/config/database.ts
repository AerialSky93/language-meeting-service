import { Pool } from "pg";

const pool: Pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "language_data_event",
  password: "abcd1234",
  port: 5432,
});

export default pool;
