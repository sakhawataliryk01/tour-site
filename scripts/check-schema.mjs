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

const p = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
try {
  const tables = await p.$queryRawUnsafe(
    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY 1"
  );
  console.log('tables:', tables.map((t) => t.tablename).join(', ') || '(none)');
  try {
    console.log('tour.count=', await p.tour.count());
    console.log('user.count=', await p.user.count());
  } catch (e) {
    console.log('model query failed (schema missing?):', String(e.message).split('\n')[0]);
  }
} finally {
  await p.$disconnect();
}
