const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const serverScript = path.join(root, 'server', 'index.js');

console.log('Starting server...');
const child = spawn(process.execPath, [serverScript], { cwd: root, detached: true, stdio: 'ignore' });
child.unref();

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

async function run() {
  await wait(600);
  try {
    // GET /api/status
    const status = await httpRequest({ method: 'GET', path: '/api/status' });
    console.log('/api/status ->', status.statusCode, status.body?.toString() );

    // POST /api/prove
    const payload = JSON.stringify({ contract: 'test-contract', method: 'proveEligibility', proof: { hash: 'deadbeef' }, publicSignals: {} });
    const post = await httpRequest({ method: 'POST', path: '/api/prove', headers: { 'Content-Type': 'application/json' }, body: payload });
    console.log('/api/prove ->', post.statusCode, post.body?.toString());

    // list proofs dir
    const proofsDir = path.join(root, 'server', 'proofs');
    const exists = fs.existsSync(proofsDir);
    console.log('proofs dir exists?', exists);
    if (exists) {
      const files = fs.readdirSync(proofsDir);
      console.log('proof files:', files);
      if (files.length > 0) {
        console.log('proof sample:', fs.readFileSync(path.join(proofsDir, files[0]), 'utf8').slice(0, 400));
      }
    }
  } catch (err) {
    console.error('E2E error:', err);
  } finally {
    try { process.kill(child.pid); } catch (e) {}
    process.exit(0);
  }
}

function httpRequest(opts) {
  return new Promise((resolve, reject) => {
    const options = { hostname: 'localhost', port: 3000, path: opts.path || '/', method: opts.method || 'GET', headers: opts.headers || {} };
    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

run();
