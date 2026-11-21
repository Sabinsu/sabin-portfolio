# Sabin Prasad Subedi — Digital Universe Portfolio

An immersive, accessible developer portfolio: a lightweight 3D space background, an animated 3D robot AI assistant, a visitor-registration gate with email notification, and themed "rooms" for automation, AI, aerospace, projects, skills, experience, education and contact.

## Features

**Experience**
- Lazy-loaded Three.js background (stars, planets, satellites, neural network, data streams, holographic grid) with mouse parallax and scroll-driven camera. Falls back to a CSS gradient/grid if WebGL is unavailable or reduced motion is on.
- 3D animated robot assistant (procedural, no model files): blinks, follows the cursor, waves, lip-moves while speaking, changes expression.
- Rooms: Command Center, Automation Lab (animated browser→extraction demo), AI Lab (honest demonstrated vs exploring), Aerospace Zone (interactive 3D), Project Gallery (3D-tilt cards + screenshot viewer), Skills, Experience & Leadership, Education + Journey, Terminal, Resume, Contact.
- Interactive terminal (`help`, `about`, `skills`, `projects`, `ask <q>`, `sudo hire sabin`…), custom cursor, magnetic buttons, optional UI sounds (off by default), dark/light theme.

**AI assistant**
- Text chat + optional voice (browser speech recognition & synthesis), 10 suggested questions, minimize/enlarge/clear.
- Uses a secure serverless endpoint (`/api/chat`) grounded in verified profile facts. Without an API key it falls back to a built-in FAQ built from the site data. It never invents facts.

**Visitor registration & backend (Vercel serverless functions in `/api`)**
- `/api/visitor`: validates name + phone + consent, spam protection (honeypot, timing, rate limit, duplicate detection), emails Sabin via Resend. Optional 90-day storage in Upstash Redis.
- `/api/contact`: contact form → email (reply-to set to the sender).
- `/api/chat`: AI proxy (API key stays server-side).
- `/api/analytics`: consent-only anonymous events logged to Vercel logs.
- The UI never claims a message/registration was sent unless the server confirmed it.

**Quality**: semantic HTML, keyboard navigation, focus management, ARIA, reduced-motion support, responsive 320px→1920px, SEO (meta, OG, JSON-LD, robots, sitemap).

## Tech stack
React 19 · Vite · Tailwind CSS v4 · Framer Motion · Three.js + React Three Fiber · Lucide · Vercel Functions (Node)

## Local development
```bash
npm install
npm run dev        # frontend only (API calls fall back gracefully)
```
To run the frontend **and** the `/api` functions locally:
```bash
npm i -g vercel
vercel dev
```
Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Environment variables
Copy `.env.example` → `.env.local` (local) and add the same names in **Vercel → Project → Settings → Environment Variables**. None are exposed to the browser.

| Variable | Needed for | Notes |
|---|---|---|
| `RESEND_API_KEY` | Visitor emails + contact form | https://resend.com/api-keys |
| `NOTIFY_EMAIL` | Where emails go | defaults to subedis784@gmail.com |
| `RESEND_FROM` | Sender | default `onboarding@resend.dev` works for testing. Verify your own domain for production |
| `ANTHROPIC_API_KEY` | AI assistant | optional; FAQ fallback without it |
| `AI_MODEL` | AI model name | default `claude-haiku-5-5` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | 90-day visitor storage + shared rate limits | optional |
| `ALLOWED_ORIGINS` | Extra allowed origins | e.g. your custom domain |

> **Resend testing note:** with the default `onboarding@resend.dev` sender, Resend only delivers to the email address that owns the Resend account. Use your own Resend sign-up email as `NOTIFY_EMAIL`, or verify a domain.

If `RESEND_API_KEY` is missing, the registration popup tells the visitor honestly that details were **not** sent and lets them continue.

## Deploy to Vercel
1. Push to GitHub, import the repo in Vercel (Framework: Vite).
2. Add the environment variables above (at minimum `RESEND_API_KEY`).
3. Deploy. Functions in `/api` deploy automatically.
4. Test: open the site in a private window → register → check your inbox.
5. Replace `sabin-subedi.vercel.app` in `index.html`, `public/robots.txt`, `public/sitemap.xml` with your real URL.

## Privacy & security
- Collected: name, mobile number, consent, timestamp, page/referrer. Visitors consent explicitly; a privacy notice is linked from the popup and footer.
- Only a "registered" flag with a 30-day expiry is kept in the browser. Name and number are never stored client-side.
- Stored records (if Upstash is configured) expire automatically after 90 days. Phone numbers used for duplicate detection are hashed.
- Origin checks, input validation, HTML escaping in emails, rate limiting, honeypot, security headers (`vercel.json`), no secrets in client code.
- Analytics are off until the visitor accepts, and are anonymous (no cookies/IDs/IPs).
- You are responsible for complying with the privacy laws that apply to you and your visitors (e.g. GDPR if EU visitors).

## Editing content
All content lives in `src/data/*.js` (profile, projects, skills, experience, services, knowledge for the FAQ). The AI's facts live in `api/_lib/facts.js`. Keep both in sync when you update your profile.

## Structure
```
api/            serverless functions (+ _lib helpers)
src/components/ UI + three/ (Robot, BackgroundScene, AerospaceScene)
src/sections/   page rooms
src/data/       editable content
src/hooks/ utils/
```
