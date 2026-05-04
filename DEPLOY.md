# Deploying Vialwise to Vercel

Two paths. Pick one.

---

## Path A — Vercel CLI (fastest, deploys from your laptop)

Requires no GitHub. Good for a first preview deploy in ~3 minutes.

```bash
cd "/Users/andrewchavez/Documents/Claude/Projects/Peptide App/website"

# 1. Install the Vercel CLI globally (one-time)
npm install -g vercel

# 2. Log in (opens a browser, sign in with email or GitHub)
vercel login

# 3. First deploy — Vercel will ask a few questions
#    - Set up and deploy? → Y
#    - Which scope? → your personal account (or your team)
#    - Link to existing project? → N
#    - Project name? → vialwise-web (or whatever)
#    - Directory? → ./ (just press enter)
#    - Override settings? → N
vercel

# 4. When happy with the preview URL, ship to production
vercel --prod
```

The CLI will give you a `*.vercel.app` URL on each run.

---

## Path B — GitHub + Vercel auto-deploy (set-and-forget)

Recommended once you're past the "tinkering" phase. Every push to `main` deploys to production; every PR gets a preview URL automatically.

### 1. Push to GitHub

```bash
cd "/Users/andrewchavez/Documents/Claude/Projects/Peptide App/website"

# Create a new private repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/vialwise-web.git
git branch -M main
git push -u origin main
```

### 2. Import into Vercel

- Go to https://vercel.com/new
- Click "Import Git Repository", pick `vialwise-web`
- Framework preset: **Next.js** (auto-detected)
- Root directory: `./` (it's already at the repo root)
- Build command, output directory, install command — all defaults
- Click **Deploy**

First build takes ~60–90 seconds. You'll get a `vialwise-web.vercel.app` URL.

---

## Environment variables (set BEFORE production cutover)

In the Vercel dashboard → your project → **Settings → Environment Variables**, add:

| Name | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_TESTFLIGHT_URL` | Your TestFlight join URL | Production, Preview |
| `CONVERTKIT_API_KEY` | From kit.com → Settings → Advanced | Production, Preview |
| `CONVERTKIT_FORM_ID` | The form ID from kit.com | Production, Preview |

`NEXT_PUBLIC_*` variables are bundled into the client. The two `CONVERTKIT_*` variables are server-only and never sent to the browser.

After adding env vars, redeploy from the Deployments tab so they take effect.

---

## Connecting `getvialwise.com` (and `vialwise.app`)

In the Vercel dashboard → your project → **Settings → Domains**:

1. Click **Add Domain**, type `getvialwise.com`. Vercel will show DNS records to add at your registrar.
2. At your registrar (where you bought the domain), add the records Vercel shows. Usually:
   - An `A` record pointing the apex (`@`) to `76.76.21.21`
   - A `CNAME` record for `www` pointing to `cname.vercel-dns.com`
3. Repeat for `vialwise.app`. Use one as primary and the other as a redirect — Vercel has a one-click toggle for this.

DNS propagation is typically 5–30 minutes. Vercel auto-issues the SSL cert once DNS resolves.

**Recommendation:** make `getvialwise.com` primary (matches the longer brand spelling and feels less app-storey). Set `vialwise.app` to redirect to it.

---

## Post-deploy checklist

- [ ] Visit production URL, click through every page (`/`, `/about`, `/privacy`, `/terms`)
- [ ] Submit a test email through the hero form, verify it lands in ConvertKit
- [ ] Click the "Join the beta" CTA, confirm the TestFlight URL is correct
- [ ] Open in mobile Safari, scroll the whole page, check the FAQ accordions work
- [ ] Confirm `support@vialwise.com` email forward exists (referenced in privacy + footer)
- [ ] Submit the privacy URL when filling out App Store Connect for v1

---

## Local dev reminder

```bash
cd website
npm run dev          # http://localhost:3100
npm run build        # production build (verify before pushing)
npm run start        # serve the production build locally
```
