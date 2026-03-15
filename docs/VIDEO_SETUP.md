# Story video setup

The backstory video in the phone mockup can be blocked by YouTube for unauthenticated viewers. Use one of these options:

## Option A: Cloudflare R2 (recommended – cost-effective)

R2 has **zero egress fees** – you pay only for storage (~$0.015/GB/month). Unlike Vercel Blob, watch time does not affect cost.

1. **Create an R2 bucket**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 Object Storage → Create bucket
   - Name it (e.g. `whatsy-story-video`)

2. **Enable public access**
   - Open the bucket → **Settings** tab
   - Under **Public access**, click **Allow Access** and enable **Public Development URL** (e.g. `https://pub-xxx.r2.dev`)
   - Or connect a **Custom domain** for production (domain must be on Cloudflare)

3. **Upload your video**
   - In the bucket → **Upload** → select your video (mp4, mov, webm)
   - Or use Wrangler CLI: `wrangler r2 object put <bucket>/backstory.mp4 --file=./backstory.mp4`

4. **Get the public URL**
   - With r2.dev: `https://pub-<hash>.r2.dev/backstory.mp4`
   - With custom domain: `https://videos.yourdomain.com/backstory.mp4`

5. **Add to `.env.local`**
   ```env
   STORY_VIDEO_URL=https://pub-xxx.r2.dev/backstory.mp4
   ```

6. Restart the dev server. Test at [http://localhost:3000/api/config/story-video](http://localhost:3000/api/config/story-video).

---

## Option B: Local MP4 (small files only)

1. Export video as MP4 (H.264), keep under ~50MB for deployment size
2. Put in `website/public/videos/`, e.g. `backstory.mp4`
3. Add to `.env.local`:
   ```env
   STORY_VIDEO_URL=/videos/backstory.mp4
   ```
   Or use `NEXT_PUBLIC_STORY_VIDEO_URL`.

---

## Option C: Vimeo

1. Upload to Vimeo, enable embedding
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STORY_VIDEO_PROVIDER=vimeo
   NEXT_PUBLIC_STORY_VIDEO_ID=<numeric-id>
   ```
   ID from embed URL: `https://player.vimeo.com/video/123456789` → `123456789`

---

## Option D: YouTube (default, free)

Uses `youtube-nocookie.com`. If blocked for unauthenticated users, use R2, local, or Vimeo.

---

## Troubleshooting

**Video still shows YouTube:** The app fetches the URL from `/api/config/story-video`. Ensure `STORY_VIDEO_URL` or `NEXT_PUBLIC_STORY_VIDEO_URL` is set, then restart the dev server.

**Test the API:** Open [http://localhost:3000/api/config/story-video](http://localhost:3000/api/config/story-video) — it should return `{"url":"https://..."}`.
