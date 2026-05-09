# Daily-KHATA — Laravel (API + web)

This app replaces the legacy **Node/Express** backend (`../backend/`). Routes match the **same `/api/...` paths** the React Native app uses.

## What’s included

- **`routes/api.php`** — Auth, profile, categories, transactions, parties, analytics, subscription (Razorpay), todos, admin, health — backed by **Supabase** (PostgREST + Auth) via `VerifySupabaseToken` middleware.
- **`GET /api/health`** — JSON health check.
- **Marketing + admin SPA** — Same React app as `../web/`, built with Vite from `resources/js/daily-khata-web/`. Served on `/`, `/pricing`, `/admin/...`, etc. (catch-all `/{any}`). Source of truth for edits is this folder; sync from `../web` with `rsync` if you still use the standalone Vite app.
- **Scheduled job** — `khata:process-reminders` (daily FCM + party reminder emails); ensure `php artisan schedule:run` is on cron in production.

## Run locally

```bash
cd laravel
composer install
cp .env.example .env
php artisan key:generate
composer run dev
```

`composer run dev` runs **PHP server + Vite + queue + logs** together. Or: `php artisan serve` and in another terminal `npm run dev` after `npm install`.

**Important:** The **real app** is the React SPA. With `npm run dev`, open **`http://127.0.0.1:5173`** (or whatever port Vite prints) — you should see **Daily-KHATA**, not the old “Laravel Vite” boilerplate. Admin API calls from the Vite dev server go to **`http://127.0.0.1:8000`** by default, so **`php artisan serve` must be running** (or use `composer run dev`, which starts both).

For **production-like** preview (single origin, no CORS), open only **`http://127.0.0.1:8000`** after `npm run build` — Laravel serves the same SPA from Blade.

Set **`APP_URL=http://127.0.0.1:8000`** in `.env` locally so tooling and CORS line up with `php artisan serve`.

Fill `.env` with `SUPABASE_*` (used by PHP **and** injected into the SPA build for `VITE_SUPABASE_*`), `RAZORPAY_*`, optional `RESEND_*` / `MAIL_*`, and Firebase keys for push.

- API: `http://127.0.0.1:8000/api/health`
- Web (landing, pricing, legal pages, admin): `http://127.0.0.1:8000/`

## Mobile app

In `app/src/config/api.ts`, set:

- `LIVE_URL` to your production Laravel base **including `/api`** (e.g. `https://api.example.com/api`).
- `USE_LOCAL = true` when using `php artisan serve` (Android emulator: `10.0.2.2:8000/api`).

## Deprecating Node

Once Laravel is live and the app points to it, you can stop deploying `../backend` or keep it as a thin proxy during cutover.
