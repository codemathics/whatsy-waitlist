type WaitlistNotificationEntry = {
  name: string;
  email: string;
  useCase: string;
};

export async function enqueueWaitlistNotification(
  entry: WaitlistNotificationEntry
): Promise<void> {
  // placeholder hook for future slack/discord/queue integrations
  console.info("[waitlist] notification hook", {
    email: entry.email,
    useCase: entry.useCase,
  });
}

export async function sendWaitlistConfirmationEmail(
  entry: WaitlistNotificationEntry
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "[waitlist] confirmation email skipped - missing RESEND_API_KEY or WAITLIST_FROM_EMAIL"
    );
    return;
  }

  console.info("[waitlist] sending confirmation to", entry.email);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [entry.email],
      subject: "You're on the Whatsy waitlist",
      text: [
        `Hi ${entry.name},`,
        "",
        "Thanks for joining the Whatsy waitlist. You're officially in.",
        `Use case noted: ${entry.useCase}`,
        "",
        "We'll reach out as soon as it's ready.",
        "",
        "- Whatsy",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send confirmation email (${response.status}): ${body}`);
  }
}
