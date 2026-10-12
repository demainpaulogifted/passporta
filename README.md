# PassPorta

A Next.js App Router starter for an independent Nigerian passport guidance and assistance platform.

## Included in this starter

- Responsive marketing landing page
- Supabase email/password signup and login
- Email OTP verification callback and password recovery flow
- Onboarding and dashboard
- Assistance request form and admin request table
- SQL schema with Row Level Security policies
- Course overview placeholder (payment is **not enabled** yet)

## Before deployment

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. In Supabase Authentication settings, enable email confirmations and configure Resend as custom SMTP. Use your verified sending domain and SMTP credentials; never put a Resend API key in a `NEXT_PUBLIC_` variable.
5. Set the Site URL to your deployed Vercel domain and add redirect URLs for `http://localhost:3000/**` and your Vercel domain.
6. Update the Supabase Confirm signup email template to use the token-hash SSR callback if using the PKCE link flow: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email` is not interchangeable with the `code` callback in all template configurations. Choose one flow consistently and test it before production. For email-code verification, set the Confirm signup email template to display the OTP token (commonly {{ .Token }}) rather than relying only on a confirmation link. Test both confirmation and password recovery flows with your actual Resend SMTP configuration.
7. Sign up using each admin email and verify it. In SQL Editor, find their UUIDs and insert them into `public.user_roles` as `admin` using the SQL comments in `schema.sql`.
8. Add the same environment variables in Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production URL, redeploy, and test signup, verification, reset password, onboarding, assistance submit and admin review.

## Important limitations

- The course content and ₦5,000 Paystack checkout are not implemented in this starter. Do not advertise payment as live until checkout initialization, server-side verification, webhook handling, entitlement storage and progress persistence are implemented and tested.
- Email OTP verification is implemented in the UI, but the Supabase Confirm signup email template must be configured to show the token code (for example, {{ .Token }}) and the flow must be tested with Resend before production.
- No email notification to the admin is wired yet. Admins can see new requests in `/admin`.
- No official affiliation or approval guarantee is claimed. Passport applications, biometrics, official fees and decisions remain with the relevant authorities.

## Local development

```bash
npm install
npm run dev