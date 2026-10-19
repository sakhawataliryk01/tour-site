# Deploy Kaiser Tours on a fresh VPS

Production domain: **https://kaiser-tours.de**  
App user (never run the site as root): **`kaisertour`**  
App path: **`/home/kaisertour/kaiser-tours`**

Assumes Ubuntu 22.04/24.04, SSH as `root` for bootstrap only, then switch to `kaisertour`.

---

## 0. DNS (do this first)

In your domain DNS:

| Type | Name | Value |
|------|------|--------|
| A | `@` | VPS public IPv4 |
| A | `www` | VPS public IPv4 |

Wait until `ping kaiser-tours.de` hits the VPS before Certbot.

---

## 1. Bootstrap as root

```bash
ssh root@YOUR_VPS_IP

apt update && apt upgrade -y
apt install -y curl git ufw build-essential ca-certificates gnupg
```

### Firewall

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

### Create app user (owns the site)

```bash
adduser --disabled-password --gecos "Kaiser Tours" kaisertour
# set a password if you want SSH password login (prefer SSH keys):
passwd kaisertour

# optional: allow sudo without password for deploy chores
usermod -aG sudo kaisertour

# SSH key for kaisertour (recommended)
mkdir -p /home/kaisertour/.ssh
cp /root/.ssh/authorized_keys /home/kaisertour/.ssh/authorized_keys
chown -R kaisertour:kaisertour /home/kaisertour/.ssh
chmod 700 /home/kaisertour/.ssh
chmod 600 /home/kaisertour/.ssh/authorized_keys
```

From now on, prefer:

```bash
ssh kaisertour@YOUR_VPS_IP
```

---

## 2. Install Node.js 22 (LTS) — system-wide

As **root**:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v   # v22.x
npm -v
```

### PM2 (global), owned at runtime by kaisertour

As **root**:

```bash
npm install -g pm2
```

As **kaisertour** later you will run `pm2 startup` so the process manager survives reboot under that user.

---

## 3. Install PostgreSQL (local on VPS)

As **root**:
V
```bash
apt install -y postgresql postgresql-contrib
systemctl enable --now postgresql

sudo -u postgres psql <<'SQL'
CREATE USER kaisertour WITH PASSWORD 'CHANGE_ME_STRONG_DB_PASSWORD';
CREATE DATABASE kaiser_tours OWNER kaisertour;
GRANT ALL PRIVILEGES ON DATABASE kaiser_tours TO kaisertour;
\c kaiser_tours
GRANT ALL ON SCHEMA public TO kaisertour;
ALTER DATABASE kaiser_tours OWNER TO kaisertour;
SQL
```

Test as `kaisertour`:

```bash
sudo -u kaisertour psql -h 127.0.0.1 -U kaisertour -d kaiser_tours -c 'SELECT 1;'
```

If password auth fails, ensure `pg_hba.conf` has a line for local password (often already `scram-sha-256` for `127.0.0.1`). Then `systemctl reload postgresql`.

---

## 4. Install Nginx + Certbot

As **root**:

```bash
apt install -y nginx certbot python3-certbot-nginx
systemctl enable --now nginx
```

Temporary HTTP site (before SSL):

```bash
cat >/etc/nginx/sites-available/kaiser-tours <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name kaiser-tours.de www.kaiser-tours.de;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        client_max_body_size 8m;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/kaiser-tours /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Issue TLS (DNS must already point here):

```bash
certbot --nginx -d kaiser-tours.de -d www.kaiser-tours.de \
  --agree-tos -m info@kaiser-tours.de --redirect
```

Certbot renews via systemd timer automatically.

---

## 5. Clone the repo as `kaisertour`

As **kaisertour**:

```bash
ssh kaisertour@YOUR_VPS_IP

cd ~
# Private GitHub example (use deploy key or HTTPS token)
git clone git@github.com:YOUR_ORG/YOUR_REPO.git kaiser-tours
# or: git clone https://github.com/YOUR_ORG/YOUR_REPO.git kaiser-tours

cd ~/kaiser-tours
```

### Deploy key (private repo)

As **kaisertour**:

```bash
ssh-keygen -t ed25519 -C "kaisertour-vps" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Add that public key as a **GitHub Deploy Key** (read-only) on the repo, then `git clone` with SSH.

---

## 6. Environment file

As **kaisertour**:

```bash
cd ~/kaiser-tours
cp .env.example .env
nano .env
```

Minimum production values:

```env
DATABASE_URL="postgresql://kaisertour:CHANGE_ME_STRONG_DB_PASSWORD@127.0.0.1:5432/kaiser_tours?schema=public"

AUTH_SECRET="paste-output-of-openssl-rand-base64-32"
AUTH_TRUST_HOST="true"
NEXTAUTH_URL="https://kaiser-tours.de"
AUTH_URL="https://kaiser-tours.de"
NEXT_PUBLIC_SITE_URL="https://kaiser-tours.de"

RESEND_API_KEY="re_..."
RESEND_FROM="Kaiser Tours <info@kaiser-tours.de>"
RESEND_ADMIN_TO="info@kaiser-tours.de"

ADMIN_INITIAL_EMAIL="admin@kaiser-tours.de"
ADMIN_INITIAL_PASSWORD="change-me-strong"

# Stripe LIVE keys in production
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Generate secret:

```bash
openssl rand -base64 32
```

`chmod 600 .env`

---

## 7. Install, DB, build

As **kaisertour**:

```bash
cd ~/kaiser-tours
npm ci

# Schema (this project often uses db push; prefer migrate if you have migrations/)
npx prisma db push
npx prisma generate

# Optional seed (admin user + sample tours) — skip on a clean live launch if you want empty data
# npx prisma db seed

npm run build

# Standalone needs static assets copied next to server.js
mkdir -p .next/standalone/.next
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# Uploads must be writable
mkdir -p public/uploads/tours
chmod -R u+rwX public/uploads
# Keep uploads outside standalone wipe: symlink is safer after rebuilds
mkdir -p ~/data/uploads/tours
rm -rf .next/standalone/public/uploads
ln -s ~/data/uploads .next/standalone/public/uploads
# Also keep repo public/uploads in sync for non-standalone tools if needed
ln -sfn ~/data/uploads ~/kaiser-tours/public/uploads
```

---

## 8. Start with PM2 (as `kaisertour`)

```bash
cd ~/kaiser-tours/.next/standalone

# .env is not auto-loaded by standalone — load from project root
# Option A: copy env into standalone
cp ~/kaiser-tours/.env ~/kaiser-tours/.next/standalone/.env

PORT=3000 HOSTNAME=0.0.0.0 pm2 start server.js --name kaiser-tours
pm2 save
pm2 startup systemd -u kaisertour --hp /home/kaisertour
# Run the command PM2 prints (needs sudo once)
```

Check:

```bash
pm2 status
pm2 logs kaiser-tours --lines 50
curl -I http://127.0.0.1:3000
curl -I https://kaiser-tours.de
```

---

## 9. Stripe webhook (production)

In Stripe Dashboard → Developers → Webhooks:

- URL: `https://kaiser-tours.de/api/webhooks/stripe`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- Copy signing secret → `STRIPE_WEBHOOK_SECRET` in `.env`
- `pm2 restart kaiser-tours`

---

## 10. Redeploy (update from git)

As **kaisertour**, one command:

```bash
cd ~/kaiser-tours && ./scripts/deploy.sh
```

That script pulls, installs, pushes the Prisma schema, builds, copies standalone assets, re-links `~/data/uploads`, and restarts PM2.

First time after clone (or if `Permission denied`):

```bash
chmod +x ~/kaiser-tours/scripts/deploy.sh
```

---

## 11. Ownership checklist

Everything under the site must be owned by `kaisertour`:

```bash
# as root if needed
chown -R kaisertour:kaisertour /home/kaisertour
```

Do **not** run `npm`, `pm2`, or `node` as root for this app.

---

## 12. Smoke test

1. `https://kaiser-tours.de` loads (HTTPS padlock)
2. `/admin/login` — seed admin or create user
3. Upload a tour image → file appears under `~/data/uploads/tours`
4. Stripe test/live checkout → webhook marks `FINAL_PAID`
5. `pm2 logs` shows no crash loops

---

## Quick reference

| Item | Value |
|------|--------|
| OS user | `kaisertour` |
| App dir | `/home/kaisertour/kaiser-tours` |
| Uploads | `/home/kaisertour/data/uploads` |
| Process | PM2 name `kaiser-tours` |
| App port | `127.0.0.1:3000` (Nginx proxies 443 → 3000) |
| TLS | Certbot + Nginx |
| DB | PostgreSQL `kaiser_tours` / user `kaisertour` |
