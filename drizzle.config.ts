import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}`);
  }
  return value;
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  dbCredentials: {
    host: getEnvVar('PG_HOST'),
    port: Number(process.env.PG_PORT) || 5432,
    user: getEnvVar('PG_USER'),
    password: getEnvVar('PG_PASSWORD'),
    database: getEnvVar('PG_DATABASE'),
    ssl: process.env.PG_SSL === 'require' ? 'require' : false,
  },
});