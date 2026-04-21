# NAGECO Backend

Express + Prisma backend prepared for cPanel Setup Node.js App.

## Local run

1. Copy `.env.example` to `.env`.
2. Update database values.
3. Install packages:
   - `npm install`
4. Generate Prisma client:
   - `npm run build`
5. Run backend:
   - `npm start`

Health endpoint:
- `GET /api/health`
- `POST /api/auth/login`

Protected admin endpoints (Bearer token required):
- `GET /api/admin/me`
- `GET /api/admin/health`

Recommended for subdomain deployment (example `https://api.nageco.com`):
- Keep `BASE_PATH` empty or unset.

Then endpoints are:
- `GET /api/health`
- `GET /api/health/db`
- `POST /api/auth/login`
- `GET /api/admin/me`

If deployed under a URL prefix (example `/nag-back` on a root domain), set:
- `BASE_PATH=/nag-back`

Then endpoints become:
- `GET /nag-back/api/health`
- `GET /nag-back/api/health/db`
- `POST /nag-back/api/auth/login`
- `GET /nag-back/api/admin/me`

Example login request:

```json
POST /api/auth/login
{
   "email": "admin@nageco.com",
   "password": "Pass@pass1"
}
```

Example protected request header:

```text
Authorization: Bearer <accessToken>
```

## cPanel deployment

1. Upload folder to: `/home/<cpanel-user>/nageco-back` (outside `public_html`).
2. Open **Setup Node.js App**.
3. Create app with:
   - **Application mode**: Production
   - **Application root**: `nageco-back`
   - **Application startup file**: `server.js`
   - **Domain**: `api.nageco.com`
   - **Application URL**: `/`
4. Add environment variables from `.env.example`.
5. Open terminal in app root and run:
   - `npm install`
   - `npm run build`
6. Restart app from cPanel.

### No Terminal in cPanel

If your hosting panel does not provide shell access:

1. Use **Run NPM Install**.
2. Use **Run JS script** and execute: `scripts/cpanel-bootstrap.js`
3. Restart the Node.js app.

The bootstrap script will:
- Run Prisma generate/migrate (if Prisma CLI is available).
- Seed admin user and default site settings.

If your Application URL contains a path (for example `https://domain.com/nag-back`), add:
- `BASE_PATH=/nag-back`

If deploying on `https://api.nageco.com` root, keep `BASE_PATH` empty.

## Notes

- This backend uses PostgreSQL through Prisma.
- Keep `NODE_ENV=production` in cPanel.
- Use `CORS_ORIGIN` as your frontend URL (or comma-separated URLs). Example: `https://nageco.com,https://www.nageco.com`.
- Set a strong `JWT_SECRET` (minimum 32 chars) for token signing.

## Logs

- Access logs are written to `logs/access.log`.
- Internal server errors (5xx) are written to `logs/error.log`.
- Optional env vars:
   - `LOG_DIR=logs` to change the log directory.
   - `LOG_TO_STDOUT=true` to keep printing request logs in console (`false` disables stdout logging).

## Troubleshooting

- If `https://domain.com/nag-back` works but `https://domain.com/nag-back/api/health` returns an Apache HTML 404 page, cPanel is not forwarding nested routes to Node.
- For subdomain deployment, verify `https://api.nageco.com/api/health` returns JSON.
- Recreate the app in **Setup Node.js App** and ensure the application URL is exactly `/` for `api.nageco.com`.
- For path deployment, ensure application URL is exactly `/nag-back` and Passenger rewrite is active for `/nag-back/*`.
