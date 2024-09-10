// lib/db.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';

// Configure the database connection using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure you set this in your .env.local
});

export async function query<T extends QueryResultRow>(text: string, params?: T[]): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    const res = await client.query<T>(text, params);
    return res;
  } finally {
    client.release();
  }
}

