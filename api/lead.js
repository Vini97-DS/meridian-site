const { Pool } = require('pg');
const { buildInviteEmailHtml, getSubject } = require('./_invite-email');

let pool;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      return {};
    }
  }
  return {};
}

function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', error: 'method_not_allowed' });
    return;
  }

  const body = readBody(req);
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const whatsapp = str(body.whatsapp || body.contact);
  const role = str(body.role);
  const notes = str(body.notes);
  const lang = str(body.lang) || 'pt';
  const page = str(body.page);

  // Step (a): save the lead. Nothing past this point is allowed to make
  // the lead itself get lost, even if invite/email fail.
  let leadId;
  try {
    const db = getPool();
    const result = await db.query(
      `INSERT INTO marketing_leads (name, email, whatsapp, role, notes, lang, page)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name || null, email || null, whatsapp || null, role || null, notes || null, lang || null, page || null]
    );
    leadId = result.rows[0].id;
  } catch (err) {
    console.error('[api/lead] failed to insert lead into Neon', {
      email, whatsapp, lang, page, error: err.message,
    });
    res.status(500).json({ status: 'error', error: 'db_insert_failed' });
    return;
  }

  // Steps (b) and (c): best-effort. Failures are logged, never thrown back
  // to the client, and leave invite_sent as false for manual follow-up.
  if (email && process.env.HUB_API_URL && process.env.HUB_ADMIN_KEY) {
    try {
      const hubRes = await fetch(`${process.env.HUB_API_URL}/api/admin/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_key: process.env.HUB_ADMIN_KEY, email }),
      });
      if (!hubRes.ok) {
        const text = await hubRes.text();
        throw new Error(`Hub invite endpoint returned ${hubRes.status}: ${text}`);
      }

      if (process.env.RESEND_API_KEY) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Meridian Fitness Hub <contact@meridianstrategy.de>',
            to: email,
            subject: getSubject(lang),
            html: buildInviteEmailHtml(lang, name),
          }),
        });
        if (!emailRes.ok) {
          const text = await emailRes.text();
          throw new Error(`Resend returned ${emailRes.status}: ${text}`);
        }

        await getPool().query('UPDATE marketing_leads SET invite_sent = true WHERE id = $1', [leadId]);
      } else {
        console.error('[api/lead] RESEND_API_KEY not configured, skipping invite email for lead', leadId);
      }
    } catch (err) {
      console.error('[api/lead] invite/email step failed for lead', leadId, err.message);
    }
  }

  res.status(200).json({ status: 'ok', id: leadId });
};
