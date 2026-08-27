# Deploying to Vercel

Checklist for putting this portfolio online. Steps 1–3 are one-time; step 6 is
what you repeat on every future change.

## 1. Push the repo to GitHub

```bash
git add -A
git commit -m "Phase 4: analytics, SEO, blog detail pages, external articles"
git push
```

`src/generated/prisma/` is gitignored on purpose — the Prisma client is
regenerated during the build (`prisma generate && next build`), so it must not
be committed.

## 2. Import the project on Vercel

- vercel.com → **Add New… → Project** → pick the GitHub repo.
- Framework preset: **Next.js** (detected automatically).
- Build command / install command / output dir: leave the defaults.

Do **not** deploy yet — set the environment variables first (step 3), otherwise
the first build fails.

## 3. Environment variables

Vercel dashboard → **Project → Settings → Environment Variables**. Add each of
these for **Production** (and Preview, if you want preview deploys to work):

| Variable | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Your Neon connection string | Same value as in `.env.local`. Use the **pooled** connection string from Neon. |
| `RESEND_API_KEY` | `re_...` | From resend.com → API Keys. |
| `CONTACT_EMAIL` | `adelyafzy@gmail.com` | Inbox that receives contact-form messages. |
| `NEXTAUTH_SECRET` | A fresh random string | Generate a **new** one for production: `npx auth secret` (do not reuse the local dev secret). |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Your real production URL, no trailing slash. Update it if you later attach a custom domain. |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Used for canonical URLs, Open Graph tags, and `sitemap.xml`. Falls back to `NEXTAUTH_URL` if you skip it. |

Chicken-and-egg note: you only learn the `*.vercel.app` URL after the first
deploy. Either deploy once, then fill in the two URL variables and redeploy, or
set them up front if you already know the project name.

## 4. Turn on Analytics

Vercel dashboard → **Project → Analytics → Enable**. The `<Analytics />`
component is already mounted in `src/app/[locale]/layout.tsx`, so page views,
referrers, devices, browsers, and top pages start collecting on the next
deploy. No extra environment variable is needed.

## 5. Create your admin user in the production database

The admin account lives in the database, not in an env var. If your production
database is the same Neon database you used locally, your existing account
already works. Otherwise, run once against the production connection string:

```bash
ADMIN_EMAIL="you@example.com" ADMIN_PASSWORD="a-strong-password" npx tsx scripts/create-admin.ts
```

## 6. Deploy and verify

Deploy, then check:

- [ ] `https://your-domain/` redirects to `/en`, and the language switcher reaches `/id`
- [ ] `https://your-domain/sitemap.xml` lists both locales plus your published posts
- [ ] `https://your-domain/robots.txt` disallows `/admin` and `/api`
- [ ] `https://your-domain/en/opengraph-image` renders the social card
- [ ] `https://your-domain/admin/login` accepts your admin credentials
- [ ] The contact form sends a real email
- [ ] Clicking a blog card opens the detail page (original) or the publisher's site (external)

## Database migrations

The schema is already migrated and up to date. When you *do* change
`prisma/schema.prisma` later:

```bash
npx prisma migrate dev --name describe-your-change
```

…locally, commit the generated folder in `prisma/migrations/`, then apply it to
production once:

```bash
npx prisma migrate deploy
```

`prisma migrate deploy` is not part of the Vercel build, so it never runs
automatically — you run it yourself against the production `DATABASE_URL`.
