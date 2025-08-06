import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('❌ SUPABASE_DB_URL is missing in .env');
  process.exit(1);
}

const client = new Client({ connectionString: dbUrl });

async function runPolicyMigration() {
  try {
    const sqlPath = path.join(__dirname, '../scripts/sql/rls_policies.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.connect();
    console.log('🚀 Connected to Supabase DB');

    await client.query(sql);
    console.log('✅ RLS policies applied successfully');
  } catch (error) {
    console.error('❌ Error applying RLS policies:', error);
  } finally {
    await client.end();
    console.log('🛑 DB connection closed');
  }
}

runPolicyMigration();
