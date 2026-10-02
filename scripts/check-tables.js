// Read-only check: prints the latest rows from `marketing_leads` and the
// matching row (if any) from the Hub's `invites` table, using DATABASE_URL
// from the environment. Never prints DATABASE_URL itself.

const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const leads = await pool.query(
    `SELECT id, name, email, whatsapp, role, notes, lang, page, created_at, invite_sent
     FROM marketing_leads ORDER BY created_at DESC LIMIT 5`
  );
  console.log('--- latest marketing_leads ---');
  console.table(leads.rows);

  const emails = leads.rows.map((r) => r.email).filter(Boolean);
  if (emails.length) {
    const invites = await pool.query(
      `SELECT email, used, created_at FROM invites WHERE email = ANY($1) ORDER BY created_at DESC`,
      [emails]
    );
    console.log('--- matching Hub invites ---');
    console.table(invites.rows);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('check-tables failed:', err.message);
  process.exit(1);
});
