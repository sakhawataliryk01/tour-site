import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const raw = fs.readFileSync('.env', 'utf8');
for (const line of raw.split(/\r?\n/)) {
  if (!line || line.startsWith('#') || !line.includes('=')) continue;
  const i = line.indexOf('=');
  let v = line.slice(i + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  process.env[line.slice(0, i).trim()] = v;
}

const p = new PrismaClient();
const users = await p.user.findMany({ select: { id: true, email: true, name: true } });
console.log(JSON.stringify(users, null, 2));
await p.$disconnect();
