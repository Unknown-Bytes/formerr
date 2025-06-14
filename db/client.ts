import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import fs from 'fs';
import path from 'path';

const sslCA = fs.readFileSync(path.resolve(process.cwd(), 'certs/ca-certificate.crt')).toString();

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCA,
  },
});

export const db = drizzle({ client: pool });