// Applies db/migrations/001_create_leads.sql against DATABASE_URL.
// Idempotent (CREATE TABLE IF NOT EXISTS) — safe to run more than once.

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main() {
  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'db', 'migrations', '001_create_leads.sql'),
    'utf8'
  );
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pool.query(sql);
  console.log('Migration applied: leads table ready.');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
