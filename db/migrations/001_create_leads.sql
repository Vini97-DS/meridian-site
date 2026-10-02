-- Marketing-site leads table: consolidates the 6 marketing-site forms
-- (waitlist EN/PT/DE + calculator gate EN/PT/DE) that used to post to the
-- Google Apps Script. Lives in the same Neon database as the Fitness Hub
-- app, as its own table — named `marketing_leads`, not `leads`, because
-- the Hub already has its own `leads` table (sales pipeline: personal_id,
-- name, phone, channel, status) that this must not collide with or touch.

CREATE TABLE IF NOT EXISTS marketing_leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT,
    email       TEXT,
    whatsapp    TEXT,
    role        TEXT,
    notes       TEXT,
    lang        TEXT,
    page        TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    invite_sent BOOLEAN DEFAULT FALSE
);
