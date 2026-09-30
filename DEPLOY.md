# Deploy Kaiser Tours on a VPS (not Vercel)

Production domain: **https://kaiser-tours.de**

## Requirements

- Ubuntu 22.04+ (or similar)
- Node.js 20+
- Nginx (or Caddy) reverse proxy + TLS (Let's Encrypt)
- PostgreSQL (managed Neon is fine, or Postgres on the same VPS)
- PM2 or systemd to keep the Node process alive

## Build for VPS (standalone)

`next.config.mjs` sets `output: 'standalone'`.

```bash
npm ci
npx prisma migrate deploy
npx prisma generate
npm run build

# Copy static assets into standalone output
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

Run:

```bash
cd .next/standalone
PORT=3000 HOSTNAME=0.0.0.0 node server.js
```

Or with PM2:

```bash
pm2 start server.js --name kaiser-tours -i 1 --cwd /var/www/kaiser-tours/.next/standalone
```

## Nginx sketch

```nginx
server {
  listen 443 ssl http2;
  server_name kaiser-tours.de www.kaiser-tours.de;

  # ssl_certificate ...;
  # ssl_certificate_key ...;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Redirect `http://` → `https://` and optionally `www` → apex.

## Environment

Copy `.env.example` → `.env` on the server. Critical values:

- `NEXTAUTH_URL=https://kaiser-tours.de`
- `NEXT_PUBLIC_SITE_URL=https://kaiser-tours.de`
- `AUTH_TRUST_HOST=true`
- Resend sender on a **verified** `kaiser-tours.de` domain
- Writable `public/uploads/tours` for Sharp-optimized tour images

## First admin user

```bash
npx prisma db seed
```

(Uses `ADMIN_INITIAL_EMAIL` / `ADMIN_INITIAL_PASSWORD` from `.env`.)

## Assets to replace before launch

| File | Purpose |
|------|---------|
| `public/logos/light-theme-logo.png` | Header, login, favicon (light backgrounds) |
| `public/logos/dark-theme-logo.png` | Footer, hero, admin sidebar (dark backgrounds) |
| `public/uploads/tours/` | Tour hero images (Sharp → WebP on upload) |
| `public/hero.svg` | Homepage hero; replace with `hero.jpg` 1920×1080 and update `Hero.js` |

On the VPS, ensure `public/uploads/tours` is writable by the Node process and included in backups.

Also update legal placeholders in `src/lib/site.js` (address, phone) and Impressum register fields.
