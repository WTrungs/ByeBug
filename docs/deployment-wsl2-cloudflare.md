# Deploy ByeBug on WSL2 with Cloudflare

This guide deploys the production backend stack in WSL2 and the frontend on Cloudflare Pages.

Production URLs:

- Backend API: `https://api.byebug.com`
- Frontend: `https://byebug.group5.com`

## 1. Prepare production env

Keep the real env file outside git:

```bash
mkdir -p ~/byebug-prod
cp .env.production.example ~/byebug-prod/.env
chmod 600 ~/byebug-prod/.env
```

Edit `~/byebug-prod/.env` and set real values for:

- `DB_PASSWORD`
- `JWT_SECRET`
- `STORAGE_ENDPOINT`
- `STORAGE_BUCKET`
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`

Generate a JWT secret:

```bash
openssl rand -hex 32
```

## 2. First manual deploy in WSL2

Run from the repo root:

```bash
docker build -t oj-cpp:latest ./judge-engine/docker-env/cpp

export BYEBUG_ENV_FILE="$HOME/byebug-prod/.env"
docker compose --env-file "$BYEBUG_ENV_FILE" -f docker-compose.prod.yml up -d --build
```

Validate:

```bash
docker compose --env-file "$HOME/byebug-prod/.env" -f docker-compose.prod.yml config
docker compose -f docker-compose.prod.yml ps
curl http://localhost:8080/actuator/health
```

## 3. Cloudflare Tunnel in WSL2

Install `cloudflared` on Ubuntu 24.04 WSL2:

```bash
sudo mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared noble main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update
sudo apt install cloudflared
```

Login and create the tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create byebug
cloudflared tunnel route dns byebug api.byebug.com
```

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /home/wtrungs/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: api.byebug.com
    service: http://localhost:8080
  - service: http_status:404
```

Install and start the systemd service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
systemctl status cloudflared
```

Validate:

```bash
curl https://api.byebug.com/actuator/health
```

## 4. GitHub Actions self-hosted runner in WSL2

In GitHub, open:

```text
WTrungs/ByeBug -> Settings -> Actions -> Runners -> New self-hosted runner -> Linux x64
```

Use the GitHub-provided download and config commands. Add these labels during config:

```text
byebug-prod,wsl,prod
```

Install as a service:

```bash
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

The workflow `.github/workflows/deploy.yml` runs on push to `main`.

## 5. Cloudflare Pages

Create a Cloudflare Pages project from `WTrungs/ByeBug`.

Settings:

```text
Framework preset: Vite
Build command: cd frontend && npm ci && npm run build
Build output directory: frontend/dist
```

Environment variable:

```env
VITE_API_BASE_URL=https://api.byebug.com/api
```

Custom domain:

```text
byebug.group5.com
```

## 6. Start WSL after Windows reboot

The WSL distro has `systemd=true`, but WSL services start only after the distro starts. Create a Windows Task Scheduler task that runs at logon:

```powershell
wsl.exe -d Ubuntu-24.04 --exec /bin/bash -lc "true"
```

After WSL starts, enabled Linux services such as Docker, `cloudflared`, and the GitHub runner can start normally.

## 7. Deploy flow

After first setup:

```bash
git add .
git commit -m "Configure production deployment"
git push origin main
```

GitHub Actions will run on the WSL2 runner and restart the backend stack.
