// Exercises api/lead.js directly (no HTTP server needed) using whatever
// env vars are already in the process (run with `node --env-file=.env.local`).
// Never prints the env vars themselves, only the function's own output.

const handler = require('../api/lead');

const testPayload = {
  name: 'TESTE PIPELINE - IGNORAR',
  email: `teste.pipeline+${Date.now()}@meridianstrategy.de`,
  whatsapp: '11955554444',
  role: 'Personal Trainer',
  notes: 'Gerado por scripts/test-lead-local.js',
  lang: 'pt',
  page: 'https://www.meridianstrategy.de/index-pt.html',
};

const req = { method: 'POST', body: testPayload };

const res = {
  _status: 200,
  status(code) { this._status = code; return this; },
  json(payload) {
    console.log('HTTP status:', this._status);
    console.log('Response body:', JSON.stringify(payload, null, 2));
  },
};

handler(req, res).catch((err) => {
  console.error('Handler threw unexpectedly:', err);
  process.exit(1);
});
