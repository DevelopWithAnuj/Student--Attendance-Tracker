import 'dotenv/config'
import * as schema from "./schema"
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Get the connection string from environment variables
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Please create a .env.local file and add it.');
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// For serverless, disable prepared statements
export const client = postgres(connectionString, { prepare: false, max: 20 })
export const db = drizzle(client, { schema });
