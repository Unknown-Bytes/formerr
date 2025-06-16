import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import * as schema from './schema';

// Read SSL certificate in production
const sslConfig = process.env.NODE_ENV === 'production'
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.resolve(process.cwd(), 'certs/ca-certificate.crt')).toString(),
    }
  : false;

// Create a single pool instance for the application
const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  ssl: sslConfig,
});

// Export the typed database client
export const db = drizzle(pool, { schema });

// Export types for type safety
export type Database = typeof db;

// Helper function to safely close the database connection
export async function closePool() {
  await pool.end();
}