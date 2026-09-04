import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const uploadDirectory = join(root, 'uploads');
const dataDirectory = process.env.DATA_DIR || join(root, 'data');
const port = Number(process.env.PORT || 4173);
function normalizePublicUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    url.hash = '';
    url.search = '';
    if (!url.pathname.endsWith('/')) url.pathname += '/';
    return url.href;
  } catch {
    console.warn(`Ignoring invalid PUBLIC_URL: ${value}`);
    return '';
  }
}

const publicUrl = normalizePublicUrl(process.env.PUBLIC_URL || '');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

await mkdir(uploadDirectory, { recursive: true });
await mkdir(dataDirectory, { recursive: true });
const database = new DatabaseSync(join(dataDirectory, 'flower-power.sqlite'));
database.exec(`CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY CHECK (id = 1), payload TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
const readState = database.prepare('SELECT payload FROM app_state WHERE id = 1');
const writeState = database.prepare(`INSERT INTO app_state (id, payload, updated_at)
  VALUES (1, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET
  payload = excluded.payload, updated_at = CURRENT_TIMESTAMP`);

function send(response, status, body, contentType = 'application/json; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': contentType });
  response.end(body);
}

async function savePlantPhoto(request, response, plantId) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 8_000_000) {
      send(response, 413, JSON.stringify({ error: 'Image is too large' }));
      return;
    }
  }

  try {
    const { image } = JSON.parse(body);
    const match = /^data:image\/(jpeg|png|webp);base64,([a-zA-Z0-9+/=]+)$/.exec(image);
    if (!match) throw new Error('Unsupported image');

    const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
    const safeId = plantId.replace(/[^a-zA-Z0-9_-]/g, '');
    const fileName = `${safeId}-${Date.now()}.${extension}`;
    await writeFile(join(uploadDirectory, fileName), Buffer.from(match[2], 'base64'));
    send(response, 201, JSON.stringify({ url: `/uploads/${fileName}` }));
  } catch {
    send(response, 400, JSON.stringify({ error: 'Invalid image payload' }));
  }
}

async function saveData(request, response) {
  let body = '';
  try {
    for await (const chunk of request) {
      body += chunk;
      if (body.length > 10_000_000) throw new Error('too-large');
    }
    const payload = JSON.parse(body);
    if (!payload || !Array.isArray(payload.types) || !Array.isArray(payload.plants)) throw new Error('invalid');
    writeState.run(JSON.stringify({ types: payload.types, plants: payload.plants }));
    send(response, 204, '');
  } catch (error) {
    send(response, error.message === 'too-large' ? 413 : 400, JSON.stringify({ error: 'Invalid data payload' }));
  }
}

async function serveFile(response, requestPath) {
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
  const filePath = normalize(join(root, relativePath));
  if (!filePath.startsWith(root)) {
    send(response, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  try {
    const file = await readFile(filePath);
    send(response, 200, file, mimeTypes[extname(filePath)] || 'application/octet-stream');
  } catch {
    send(response, 404, 'Not found', 'text/plain; charset=utf-8');
  }
}

createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (request.method === 'GET' && url.pathname === '/api/config') {
    send(response, 200, JSON.stringify({ publicUrl }));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/api/data') {
    const row = readState.get();
    send(response, 200, row ? row.payload : 'null');
    return;
  }
  if (request.method === 'PUT' && url.pathname === '/api/data') {
    await saveData(request, response);
    return;
  }
  const photoRoute = /^\/api\/plants\/([^/]+)\/photo$/.exec(url.pathname);
  if (request.method === 'POST' && photoRoute) {
    await savePlantPhoto(request, response, photoRoute[1]);
    return;
  }
  await serveFile(response, url.pathname);
}).listen(port, () => console.log(`Flower Power: http://localhost:${port}`));
