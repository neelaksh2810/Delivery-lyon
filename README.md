# Student Delivery Lyon

Next.js 14 site with Supabase (database) and Stripe (payments), made to deploy on Vercel.

Pages: `/` home, `/book` booking form and Stripe Checkout, `/ride` rider application, `/success`, `/admin` (password protected).

## Status

Written but not yet built or run: the sandbox that produced it could not install npm packages. The first `npm install && npm run build` on your computer or on Vercel is the real test. Send me any error it prints.

## Deploy in 4 steps

1. **GitHub.** Create a private repo, push this folder to it.
2. **Vercel.** vercel.com > Add New Project > import the repo. Framework: Next.js. Add the environment variables below, then deploy.
3. **Stripe.** In the Stripe dashboard (test mode first):
   - Developers > API keys: copy the secret key to `STRIPE_SECRET_KEY`.
   - Developers > Webhooks > Add endpoint: `https://YOUR-SITE/api/webhook`, event `checkout.session.completed`. Copy its signing secret to `STRIPE_WEBHOOK_SECRET`.
   - Redeploy on Vercel after adding the variables.
4. **Test.** Book a delivery with the test card `4242 4242 4242 4242`, any future date, any CVC. The request should appear in `/admin` with status `paid`.

## Environment variables

See `.env.example`. `SUPABASE_URL` is already filled in. Get `SUPABASE_SERVICE_ROLE_KEY` from Supabase > Project Settings > API Keys. It is a secret: only put it in Vercel's settings, never in the code or in a chat.

## How the money works

- Prices live in `lib/services.js` and are set again on the server for every payment, so visitors cannot change what they pay.
- Stripe takes roughly 1.5% + €0.25 per card payment in Europe. On a €2.50 parcel that is about €0.29, which is close to half of your 25% commission. Push bundles and the monthly plan.
- v1 collects the full amount into your Stripe account. Paying riders out through Stripe Connect is the next step. Until then, pay riders by bank transfer from the `/admin` list.

## Not built yet

Monthly €9.99 plan (Stripe Billing), automatic rider payouts (Stripe Connect), confirmation emails, rider login, delivery photos.
