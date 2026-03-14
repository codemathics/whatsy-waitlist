import { NextResponse } from "next/server";
import { createWaitlistEntry, waitlistEntryExists } from "@/lib/waitlist/notion";
import {
  enqueueWaitlistNotification,
  sendWaitlistConfirmationEmail,
} from "@/lib/waitlist/notifications";

type WaitlistPayload = {
  name?: string;
  email?: string;
  useCase?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkNotionConfig(): string | null {
  if (!process.env.NOTION_API_KEY?.trim())
    return "NOTION_API_KEY is not set. Add it to website/.env.local";
  if (!process.env.NOTION_WAITLIST_DATABASE_ID?.trim())
    return "NOTION_WAITLIST_DATABASE_ID is not set. Add it to website/.env.local";
  return null;
}

export async function POST(req: Request) {
  const configError = checkNotionConfig();
  if (configError) {
    console.error("[waitlist]", configError);
    return NextResponse.json(
      { error: "Waitlist signup is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json()) as WaitlistPayload;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const useCase = body.useCase?.trim() ?? "";

    if (!name || !email || !useCase) {
      return NextResponse.json(
        { error: "Name, email, and use case are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const exists = await waitlistEntryExists(email);
    if (exists) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    await createWaitlistEntry({ name, email, useCase, source: "website" });

    const entry = { name, email, useCase };
    const notificationResults = await Promise.allSettled([
      enqueueWaitlistNotification(entry),
      sendWaitlistConfirmationEmail(entry),
    ]);

    const emailSent = notificationResults[1]?.status === "fulfilled";

    return NextResponse.json({ ok: true, emailSent }, { status: 201 });
  } catch (error) {
    console.error("[waitlist] submit failed", error);

    const err = error as { code?: string; status?: number; message?: string };
    if (err.status === 401 || err.code === "unauthorized") {
      return NextResponse.json(
        { error: "Waitlist integration is not authorized. Please contact support." },
        { status: 503 }
      );
    }

    if (err.status === 404 || err.code === "object_not_found") {
      return NextResponse.json(
        { error: "Waitlist database was not found or not shared with integration." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Unable to submit waitlist request right now." },
      { status: 500 }
    );
  }
}
