# Deploying Vialwise to Vercel

> **For Cowork / Claude Code agents:** the steps below are split into `[YOU]` (interactive — needs Andrew's hands or browser) and `[AGENT]` (Claude can run autonomously). Work top-to-bottom. Stop and surface errors instead of guessing.
>
> **Working directory for all commands:** `/Users/andrewchavez/Documents/Claude/Projects/Peptide App/website`

---

## Quick status check (run first, every session)

```bash
cd "/Users/andrewchavez/Documents/Claude/Projects/Peptide App/website"
git status
git log --oneline -5
ls -la .env.local 2>/dev/null && echo "env file present" || echo "no .env.local yet"
which vercel && vercel whoami 2>/dev/null
```

This tells the agent exactly which step you're on without asking you.

---

## Step 1 — Install the Vercel CLI

`[AGENT]` Run:
```bash
npm install -g vercel
vercel --version
```
Expected: prints a version number like `vercel/39.x`. If permission errors, switch to `npx vercel` for everything below.

---

## Step 2 — Log into Vercel

`[YOU]` This step requires a browser interaction the agent can't perform.

```bash
vercel login
```
Pick "Continue with GitHub" or "Continue with Email". Browser opens, you confirm, terminal returns to prompt.

Verify:
```bash
vercel whoami
```
Expected: prints your username/email. If it does, **tell the agent "logged in"** and continue to Step 3.

---

## Step 3 — First (preview) deploy

`[AGENT]` From `website/`:
```bash
vercel
```

The CLI will ask 5-6 questions. Recommended answers:

| Prompt | Answer |
|---|---|
| Set up and deploy? | `y` |
| Which scope? | `Andrew Chavez` (or whatever team you're under) |
| Link to existing project? | `n` |
| What's your project's name? | `vialwise-web` |
| In which directory is your code located? | `./` |
| Want to override the settings? | `n` |

Output ends with a `https://vialwise-web-xxx.vercel.app` URL. **`[YOU]` Open it in a browser and click through `/`, `/about`, `/privacy`, `/terms` to confirm everything renders.**

If the agent has shell access but can't answer prompts interactively, use:
```bash
vercel --yes --name vialwise-web
```
(non-interactive mode, accepts all defaults)

---

## Step 4 — Set up ConvertKit (Kit)

`[YOU]` Browser-only.

1. Go to https://kit.com → Sign up (free up to 10K subscribers)
2. After signup, **Grow → Landing Pages & Forms → + Create New → Inline Form**
3. Name it "Vialwise launch waitlist". Style doesn't matter — we use our own form.
4. Click **Settings (gear icon) → Embed → HTML**. Copy the **form ID** from the embed URL — it's the number in `forms/XXXXXX/subscribe`.
5. Then go to **Account → Settings → Advanced → API**. Copy the **API Key** (NOT the API Secret).

`[AGENT]` Once Andrew gives you the API key + form ID, write them to `.env.local`:
```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_TESTFLIGHT_URL=
CONVERTKIT_API_KEY=PASTE_KEY_HERE
CONVERTKIT_FORM_ID=PASTE_FORM_ID_HERE
EOF
```
(Replace the placeholder values with what Andrew provides.)

Test it locally:
```bash
npm run dev -- --port 3100 &
sleep 3
curl -s -X POST http://localhost:3100/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"andrew+kittest@vialwise.com"}'
```
Expected: `{"ok":true}`. Then check Kit dashboard for the new subscriber.

---

## Step 5 — Get TestFlight URL

`[YOU]` Browser-only.

1. https://appstoreconnect.apple.com → My Apps → Vialwise (must already exist; if not, create it)
2. **TestFlight tab → External Testing → + (create a group)** → name it "Beta"
3. Once you have at least one approved build, the group page shows a **public link** field — toggle it ON, copy the `https://testflight.apple.com/join/XXXXX` URL

`[AGENT]` Once Andrew provides the URL, append/replace in `.env.local`:
```bash
# Edit .env.local to set:
# NEXT_PUBLIC_TESTFLIGHT_URL=https://testflight.apple.com/join/XXXXX
```

---

## Step 6 — Push env vars to Vercel

`[AGENT]`:
```bash
vercel env add NEXT_PUBLIC_TESTFLIGHT_URL production
# Paste value when prompted, hit enter

vercel env add CONVERTKIT_API_KEY production
# Paste, enter

vercel env add CONVERTKIT_FORM_ID production
# Paste, enter

# Repeat for preview environment so PR previews work
vercel env add NEXT_PUBLIC_TESTFLIGHT_URL preview
vercel env add CONVERTKIT_API_KEY preview
vercel env add CONVERTKIT_FORM_ID preview
```

Or do it in the Vercel dashboard at **Settings → Environment Variables** (faster if pasting many).

---

## Step 7 — Production deploy

`[AGENT]`:
```bash
vercel --prod
```

Output: `https://vialwise-web.vercel.app`. **`[YOU]` test the live URL — submit a real email, click the TestFlight link.**

---

## Step 8 — Connect `getvialwise.com` and `vialwise.app`

`[AGENT]`:
```bash
vercel domains add getvialwise.com vialwise-web
vercel domains add vialwise.app vialwise-web
vercel domains inspect getvialwise.com
vercel domains inspect vialwise.app
```

The `inspect` commands print the DNS records you need to add at your registrar. They look like:
```
A      @     76.76.21.21
CNAME  www   cname.vercel-dns.com
```

`[YOU]` Add those records at the registrar (likely Namecheap, Cloudflare, or wherever you bought the domains). DNS usually propagates in 5-30 min.

`[AGENT]` Verify after Andrew says DNS is set:
```bash
dig +short getvialwise.com
dig +short vialwise.app
vercel domains inspect getvialwise.com    # should show "Verified"
```

`[YOU]` In the Vercel dashboard → **Settings → Domains**, set `getvialwise.com` as primary and configure `vialwise.app` to redirect to it (one-click toggle).

---

## Step 9 — Set up `support@vialwise.com`

`[YOU]` Wherever you bought `getvialwise.com` (registrar), set up email forwarding from `support@vialwise.com` and `support@getvialwise.com` to your personal inbox. Most registrars include free forwarding.

Referenced in: footer, privacy policy, terms of service. Has to work before App Store submission.

---

## Step 10 — Optional: switch to GitHub auto-deploy

After the first manual `vercel --prod` works, link the project to a GitHub repo so every push to `main` auto-deploys.

`[YOU]` Create a new private GitHub repo at https://github.com/new, name it `vialwise-web`. Don't initialize with anything (no README, no .gitignore — we have those).

`[AGENT]`:
```bash
git remote add origin https://github.com/YOUR_USERNAME/vialwise-web.git
git branch -M main
git push -u origin main
```

`[YOU]` In Vercel dashboard → your project → **Settings → Git → Connect Git Repository** → pick the new repo. Done. Future `git push` to `main` triggers a production deploy automatically. PRs get preview URLs.

---

## Final acceptance checklist

`[YOU]` Once everything's live:

- [ ] `https://getvialwise.com` loads, all pages work
- [ ] `https://vialwise.app` redirects to `getvialwise.com`
- [ ] Submit a test email through the hero form → confirm subscriber appears in Kit
- [ ] Click "Join the beta" CTA → opens TestFlight join page
- [ ] Send a test email to `support@vialwise.com` → arrives in your inbox
- [ ] Open https://getvialwise.com on mobile Safari → scroll, tap FAQ items, verify nothing breaks
- [ ] Run https://pagespeed.web.dev/?url=https%3A%2F%2Fgetvialwise.com → confirm Performance >= 90, Accessibility >= 95

When all six are checked, the privacy URL (`https://getvialwise.com/privacy`) is the one you submit to App Store Connect during v1 review.

---

## Local dev reminder

```bash
cd "/Users/andrewchavez/Documents/Claude/Projects/Peptide App/website"
npm run dev          # http://localhost:3100
npm run build        # verify production build before pushing
npm run start        # serve the production build locally
```
