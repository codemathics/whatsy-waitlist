# Resend setup for waitlist confirmation emails

When users join the waitlist, they can receive a confirmation email if Resend is configured. Follow these steps to enable it.

## Why am I not receiving emails?

Most often it’s one of these:

1. **Sandbox restriction (testing without a domain)**  
   If you use `onboarding@resend.dev`, Resend **only delivers to the email tied to your Resend account**. It will not send to arbitrary signups (e.g. friend@email.com). To send to anyone, you must verify your own domain (step 2 below).

2. **Missing or wrong env vars**  
   `RESEND_API_KEY` and `WAITLIST_FROM_EMAIL` must be set in `.env.local` (local) and in Vercel (production). Redeploy after changing Vercel env vars.

3. **Domain not verified**  
   If you use a custom domain in `WAITLIST_FROM_EMAIL`, that domain must be verified in Resend (Domains → add domain → add DNS records → wait for verification).

## 1. Create a Resend account

Sign up at [resend.com](https://resend.com).

## 2. Verify your domain

1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain (e.g. `whatsy.ai` or a subdomain like `updates.whatsy.ai`)
3. Add the DNS records (MX, SPF, DKIM) Resend provides to your DNS provider
4. Wait for verification (usually 5–10 minutes)

Using a subdomain (e.g. `updates.whatsy.ai`) is recommended for deliverability.

## 3. Create an API key

1. Go to [Resend API Keys](https://resend.com/api-keys)
2. Create a new API key with "Send" permission
3. Copy the key (starts with `re_`)

## 4. Set environment variables

**Local (website/.env.local):**
```
RESEND_API_KEY=re_xxxxxxxxxxxx
WAITLIST_FROM_EMAIL=Whatsy <onboard@yourdomain.com>
```

`WAITLIST_FROM_EMAIL` must be a full email address, e.g. `onboard@waitlist.whatsy.ai` or `Whatsy <onboard@waitlist.whatsy.ai>`. Using only a domain (e.g. `waitlist.whatsy.ai`) will fail with a 422 error.

**Vercel (Project → Settings → Environment Variables):**
- `RESEND_API_KEY` – your Resend API key
- `WAITLIST_FROM_EMAIL` – sender address using your verified domain, e.g. `Whatsy <updates@yourdomain.com>`

The `from` address must use a domain you verified in Resend. Until a domain is verified, you can test with `onboarding@resend.dev` (Resend’s sandbox); it only delivers to the email on your Resend account.

## 5. Redeploy

After updating env vars on Vercel, redeploy so the new variables take effect.

## Troubleshooting

- **Emails not sending:** Check Vercel logs for `[waitlist] confirmation email skipped` or Resend errors
- **Domain not verified:** Confirm all DNS records are added and propagated
- **Wrong sender:** `WAITLIST_FROM_EMAIL` must use a verified domain
