import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const raw = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.startsWith('#') || !line.includes('=')) continue;
  const i = line.indexOf('=');
  const key = line.slice(0, i).trim();
  let val = line.slice(i + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const original = env.DATABASE_URL;
const url = new URL(original.replace(/^postgresql:/, 'postgres:'));
console.log('host=', url.hostname);
console.log('port=', url.port || '5432');
console.log('db=', url.pathname);
console.log('sslmode=', url.searchParams.get('sslmode'));
console.log('channel_binding=', url.searchParams.get('channel_binding'));
console.log('user=', url.username);

async function tryConnect(label, connectionString) {
  const p = new PrismaClient({ datasources: { db: { url: connectionString } } });
  try {
    const r = await p.$queryRawUnsafe('SELECT 1 as ok');
    console.log(label, 'OK', r);
    return true;
  } catch (e) {
    console.log(label, 'FAIL:', String(e.message).split('\n')[0]);
    return false;
  } finally {
    await p.$disconnect();
  }
}

const withoutChannel = original
  .replace('&channel_binding=require', '')
  .replace('?channel_binding=require&', '?')
  .replace('?channel_binding=require', '');

const directHost = original.replace('-pooler.c-6', '.c-6');

await tryConnect('pooler+channel_binding', original);
await tryConnect('pooler-no-channel_binding', withoutChannel);
await tryConnect('direct-no-channel_binding', directHost.replace('&channel_binding=require', '').replace('?channel_binding=require&', '?'));
