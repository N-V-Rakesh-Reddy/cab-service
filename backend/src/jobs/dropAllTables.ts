import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL!;

const client = new Client({ connectionString: dbUrl });

async function dropAllTables() {
  try {
    await client.connect();
    console.log('Connected to Supabase DB');

    // Fetch all table names under 'public' schema
    const res = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `);

    const tableNames: string[] = res.rows.map(row => row.tablename);

    // Drop all tables first
    for (const table of tableNames) {
      console.log(`Dropping table: ${table}`);
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    // Fetch all custom types (ENUMs) under 'public' schema
    const typesRes = await client.query(`
      SELECT typname
      FROM pg_type
      WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND typtype = 'e'
    `);

    const typeNames: string[] = typesRes.rows.map(row => row.typname);

    // Drop all custom types (ENUMs)
    for (const typeName of typeNames) {
      console.log(`Dropping type: ${typeName}`);
      await client.query(`DROP TYPE IF EXISTS "${typeName}" CASCADE`);
    }

    console.log('✅ All tables and types dropped successfully');
  } catch (err) {
    console.error('❌ Error dropping tables and types:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🛑 DB connection closed');
    process.exit(0);
  }
}

dropAllTables();
