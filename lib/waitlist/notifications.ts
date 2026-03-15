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
      subject: `${entry.name}, you're on the Whatsy waitlist!`,
      html: [
        `hi ${entry.name},`,
        "",
        "<p>thanks for joining the Whatsy waitlist. you're officially in.</p>",
        `<p>your use case, <strong>${entry.useCase}</strong>, will help me understand how to best build for you.</p>`,
        "",
        "<p>can't wait to share whatsy with you soon!</p>",
        "",
        "<p>- clement and the Whatsy team</p>",
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to send confirmation email (${response.status}): ${body}`);
  }
}
