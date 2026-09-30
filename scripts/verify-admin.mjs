import bcrypt from 'bcryptjs';
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

const email = (process.env.ADMIN_INITIAL_EMAIL || 'admin@kaiser-tours.de').trim().toLowerCase();
const password = process.env.ADMIN_INITIAL_PASSWORD || 'SecureAdminPassword123!';

const p = new PrismaClient();
const u = await p.user.findUnique({ where: { email } });
if (!u) {
  console.log('NO_USER', email);
} else {
  const ok = await bcrypt.compare(password, u.passwordHash);
  console.log('email=', u.email);
  console.log('passwordMatchesEnv=', ok);
}
await p.$disconnect();
