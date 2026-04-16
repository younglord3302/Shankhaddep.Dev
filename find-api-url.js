const https = require('https');

console.log('=== Finding InSForge REST API URL ===\n');

const urls = [
  'https://v96ifskx.ap-southeast.insforge.app/rest/v1/',
  'https://v96ifskx.api.insforge.app/rest/v1/',
  'https://api.insforge.app/v96ifskx/rest/v1/',
  'https://v96ifskx.ap-southeast.insforge.app/api/v1/',
  'https://api.insforge.app/v1/',
];

const ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || ''; // Use environment variable instead of hardcoding

let idx = 0;
function checkNext() {
  if (idx >= urls.length) {
    console.log('\n=== Done ===');
    return;
  }
  const url = urls[idx++];
  const parsed = new URL(url);
  const req = https.request({
    hostname: parsed.hostname,
    path: parsed.pathname,
    method: 'GET',
    headers: { 'apikey': ANON_KEY },
    timeout: 8000
  }, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
      const preview = body.substring(0, 100);
      if (res.statusCode === 200) {
        console.log(`✅ ${url} → ${res.statusCode} ${preview}`);
      } else if (res.statusCode === 401 || res.statusCode === 403) {
        console.log(`⚠️  ${url} → ${res.statusCode} (auth required - API exists!)`);
      } else if (res.statusCode === 404) {
        console.log(`❌ ${url} → ${res.statusCode}`);
      } else {
        console.log(`⚠️  ${url} → ${res.statusCode} ${preview}`);
      }
      checkNext();
    });
  });
  req.on('error', () => { console.log(`❌ ${url} → Connection error`); checkNext(); });
  req.on('timeout', () => { console.log(`❌ ${url} → Timeout`); req.abort(); checkNext(); });
  req.end();
}
checkNext();
