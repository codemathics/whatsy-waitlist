const nextConfig = {
  images: { unoptimized: true },
  // explicitly pass story video url so it's available client-side (next_public_ can be flaky)
  env: {
    NEXT_PUBLIC_STORY_VIDEO_URL: process.env.NEXT_PUBLIC_STORY_VIDEO_URL || "",
  },
};

module.exports = nextConfig;
