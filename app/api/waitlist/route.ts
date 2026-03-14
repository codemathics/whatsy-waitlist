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

    const emailResult = notificationResults[1];
    const emailSent = emailResult?.status === "fulfilled";
    if (emailResult?.status === "rejected") {
      console.error("[waitlist] confirmation email failed:", emailResult.reason);
    }

    return NextResponse.json({ ok: true, emailSent }, { status: 201 });
  } catch (error) {
    const err = error as {
      code?: string;
      status?: number;
      message?: string;
      body?: string | { code?: string; message?: string };
    };
    let notionCode = err.code;
    let notionMsg = err.message ?? "";
    if (typeof err.body === "string") {
      try {
        const parsed = JSON.parse(err.body) as { code?: string; message?: string };
        notionCode = notionCode ?? parsed.code;
        notionMsg = notionMsg || (parsed.message ?? "");
      } catch {
        notionMsg = notionMsg || err.body;
      }
    } else if (err.body && typeof err.body === "object") {
      notionCode = notionCode ?? (err.body as { code?: string }).code;
      notionMsg = notionMsg || ((err.body as { message?: string }).message ?? "");
    }
    if (!notionMsg && error instanceof Error) notionMsg = error.toString();

    console.error("[waitlist] submit failed:", {
      code: notionCode,
      status: err.status,
      message: notionMsg,
      raw: String(error),
      hasApiKey: !!process.env.NOTION_API_KEY,
      hasDbId: !!process.env.NOTION_WAITLIST_DATABASE_ID,
    });

    if (err.status === 401 || notionCode === "unauthorized") {
      return NextResponse.json(
        {
          error:
            "Notion integration token is invalid or expired. Check NOTION_API_KEY in .env.local (local) or Vercel env vars (prod). Create a new token at notion.so/my-integrations.",
        },
        { status: 503 }
      );
    }

    if (err.status === 404 || notionCode === "object_not_found") {
      return NextResponse.json(
        {
          error:
            "Waitlist database not found. Share the database with your integration: open the database in Notion → Share → Invite → add your integration.",
        },
        { status: 503 }
      );
    }

    if (err.status === 400 || notionCode === "validation_error") {
      return NextResponse.json(
        {
          error: "Database schema mismatch. Ensure your Notion database has: Name, Email, Use Case, Source, Submitted At.",
          details: notionMsg,
        },
        { status: 400 }
      );
    }

    const debugDetails =
      process.env.NODE_ENV === "development" ? notionMsg || String(error) : undefined;
    return NextResponse.json(
      {
        error: "Unable to submit waitlist request right now.",
        details: debugDetails,
      },
      { status: 500 }
    );
  }
}
