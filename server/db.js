import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema.js';

// Create the connection
const connectionString = process.env.VITE_SUPABASE_URL ? 
  `postgresql://postgres:[YOUR-PASSWORD]@db.xgqoxcaqttleyxhemytk.supabase.co:5432/postgres` :
  process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('⚠️ No database connection string found. Using fallback mode.');
  // Create a mock database for local testing without Supabase
  export const db = null;
  export async function testConnection() {
    console.log('⚠️ Database not configured - using file-based storage');
    return false;
  }
} else {
  try {
    // Create postgres client
    const client = postgres(connectionString);
    
    // Create drizzle instance
    export const db = drizzle(client, { schema });
    
    // Test connection
    export async function testConnection() {
      try {
        await client`SELECT 1`;
        console.log('✅ Database connected successfully');
        return true;
      } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    export const db = null;
    export async function testConnection() {
      console.log('⚠️ Database setup failed - using file-based storage');
      return false;
    }
  }
}