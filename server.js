import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const uploadDirectory = join(root, 'uploads');
const port = Number(process.env.PORT || 4173);
const publicUrl = process.env.PUBLIC_URL || '';
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

await mkdir(uploadDirectory, { recursive: true });

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
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (request.method === 'GET' && url.pathname === '/api/config') {
    send(response, 200, JSON.stringify({ publicUrl }));
    return;
  }
  const photoRoute = /^\/api\/plants\/([^/]+)\/photo$/.exec(url.pathname);
  if (request.method === 'POST' && photoRoute) {
    await savePlantPhoto(request, response, photoRoute[1]);
    return;
  }
  await serveFile(response, url.pathname);
}).listen(port, () => console.log(`Flower Power: http://localhost:${port}`));
