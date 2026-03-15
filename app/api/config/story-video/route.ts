import { NextResponse } from "next/server";

// server-only env (story_video_url); avoids next_public_ loading quirks
export async function GET() {
  const url = (process.env.STORY_VIDEO_URL || process.env.NEXT_PUBLIC_STORY_VIDEO_URL || "").trim();
  return NextResponse.json({ url: url || null });
}
