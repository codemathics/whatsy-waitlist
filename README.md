# whatsy – landing page

marketing site for whatsy. built with **next.js 14**, **typescript**, and **tailwind css**. ready to deploy on **vercel**.

**stack:**

- next.js 14 (app router)
- typescript
- tailwind css
- static export (`output: 'export'`) for simple hosting

**content (phase 1, no payment):**

- get started cta
- email capture (mailto for v1)
- "download for macos"
- "telegram, discord and more coming soon."

**later:** add stripe ($5 lifetime + $2/mo or yearly for updates).

## develop

```bash
cd website
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000).

## build (static export)

```bash
npm run build
```

output is in `out/`. you can serve it with any static host.

## deploy on vercel

1. push this repo to github (or connect your git provider in vercel).
2. in [vercel](https://vercel.com), import the project and set **root directory** to `website`.
3. vercel will detect next.js and use the default build command (`next build`) and output.
4. deploy.

or use the vercel cli from the repo root:

```bash
cd website
npx vercel
```

if you remove `output: 'export'` from `next.config.js`, vercel will run next.js as a server (full ssr/api routes). the current static export is ideal for a simple landing page.
# whatsy-waitlist
