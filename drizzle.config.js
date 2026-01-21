import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js', // update extension to .js if your schema is JS
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,   // Supabase ka connection string
  },
});
