const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname, '..');
const MANAGED_DIR = process.env.COMPACT_MANAGED_DIR || path.join(ROOT, 'node_modules', '@midnight-ntwrk', 'midnight-js-compact', 'managed');
const PROOFS_DIR = path.join(__dirname, 'proofs');

if (!fs.existsSync(PROOFS_DIR)) fs.mkdirSync(PROOFS_DIR, { recursive: true });

function jsonResponse(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function handleRoot(req, res) {
  jsonResponse(res, 200, { service: 'zk-scholar-backend', version: '0.1.0', endpoints: ['/api/status', '/api/prove'] });
}

function handleStatus(req, res) {
  const managedExists = fs.existsSync(MANAGED_DIR) && fs.readdirSync(MANAGED_DIR).length > 0;
  jsonResponse(res, 200, { managedPresent: managedExists, managedPath: MANAGED_DIR });
}

async function handleProve(req, res) {
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    const data = body ? JSON.parse(body) : {};

    if (!data.proof) {
      return jsonResponse(res, 400, { error: 'missing proof in request body' });
    }

    const id = Date.now();
    const filename = path.join(PROOFS_DIR, `proof-${id}.json`);
    fs.writeFileSync(filename, JSON.stringify({ receivedAt: new Date().toISOString(), proof: data.proof, publicSignals: data.publicSignals || null }, null, 2));

    // If compiled artifacts present we could run verifier here. For now we save and return a stub response.
    const managedExists = fs.existsSync(MANAGED_DIR) && fs.readdirSync(MANAGED_DIR).length > 0;

    jsonResponse(res, 200, { status: 'saved', file: filename, managedPresent: managedExists, verified: false, note: managedExists ? 'verification not implemented' : 'managed artifacts missing' });
  } catch (err) {
    jsonResponse(res, 500, { error: String(err) });
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === 'GET' && url.pathname === '/') return handleRoot(req, res);
  if (req.method === 'GET' && url.pathname === '/api/status') return handleStatus(req, res);
  if (req.method === 'POST' && url.pathname === '/api/prove') return handleProve(req, res);

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, () => {
  console.log(`zk-scholar backend listening on http://localhost:${PORT}`);
  console.log(`COMPACT_MANAGED_DIR=${MANAGED_DIR}`);
});

process.on('SIGINT', () => process.exit(0));
