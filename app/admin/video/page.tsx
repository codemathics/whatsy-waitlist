import Link from "next/link";

export default function AdminVideoPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to site
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Story video setup</h1>
        <p className="mt-2 text-gray-600">
          Use Cloudflare R2 for cost-effective hosting (zero egress fees). See{" "}
          <code className="rounded bg-gray-100 px-1">website/docs/VIDEO_SETUP.md</code> for full instructions.
        </p>

        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="font-semibold text-green-900">Cloudflare R2</h2>
          <p className="mt-1 text-sm text-green-800">
            Zero egress fees – you pay only for storage. Watch time does not affect cost.
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-green-800">
            <li>Cloudflare Dashboard → R2 → Create bucket</li>
            <li>Bucket Settings → Public access → Allow access (r2.dev or custom domain)</li>
            <li>Upload your video to the bucket</li>
            <li>Copy the public URL (e.g. <code className="rounded bg-green-100 px-1">https://pub-xxx.r2.dev/backstory.mp4</code>)</li>
            <li>Add <code className="rounded bg-green-100 px-1">STORY_VIDEO_URL=&lt;url&gt;</code> to .env.local (and Vercel env vars for prod)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
