import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import fs from 'fs';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}`);
  }
  return value;
}

function getSSLConfig() {
  if (process.env.PG_SSL === 'require') {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./certs/ca-certificate.crt").toString()
    };
  }
  return false;
}

export default defineConfig({  
  out: './migrations',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: getEnvVar('PG_HOST'),
    port: Number(process.env.PG_PORT) || 5432,
    user: getEnvVar('PG_USER'),
    password: getEnvVar('PG_PASSWORD'),
    database: getEnvVar('PG_DATABASE'),
    ssl: getSSLConfig()
  },
});