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

const client = new Client({
  connectionString: dbUrl,
});

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, '../scripts/sql/init_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    await client.connect();
    console.log('🚀 Connected to Supabase DB');

    await client.query(sql);
    console.log('✅ Schema created successfully');
  } catch (error) {
    console.error('❌ Error running schema migration:', error);
    await client.end();
    process.exit(1);
  } finally {
    await client.end();
    console.log('🛑 DB connection closed');
  }
}

runMigration()
  .then(() => {
    console.log('✨ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
