# Whatsy – Landing page

Marketing site for Whatsy. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Ready to deploy on **Vercel**.

**Stack:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Static export (`output: 'export'`) for simple hosting

**Content (Phase 1, no payment):**

- Get Started CTA
- Email capture (mailto for v1)
- "Download for macOS"
- "Telegram, Discord and more coming soon."

**Later:** Add Stripe ($5 lifetime + $2/mo or yearly for updates).

## Develop

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build (static export)

```bash
npm run build
```

Output is in `out/`. You can serve it with any static host.

## Deploy on Vercel

1. Push this repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), import the project and set **Root Directory** to `website`.
3. Vercel will detect Next.js and use the default build command (`next build`) and output.
4. Deploy.

Or use the Vercel CLI from the repo root:

```bash
cd website
npx vercel
```

If you remove `output: 'export'` from `next.config.js`, Vercel will run Next.js as a server (full SSR/API routes). The current static export is ideal for a simple landing page.
# whatsy-waitlist
