# Student Delivery Lyon

Next.js 14 site with Supabase (database), made to deploy on Vercel. Stripe card payment is optional and off until you add the keys.

Pages: `/` home, `/book` booking form, `/ride` rider application, `/faq`, `/legal`, `/success`, `/admin` (password protected).

## Status

Written but not yet built or run: the sandbox that produced it could not install npm packages. The first Vercel build is the real test. Send any error back.

## Deploy on Vercel (no Stripe needed)

1. Vercel > Add New > Project > import this repo. Framework: Next.js.
2. Add these environment variables, then deploy:
   - `SUPABASE_URL` = `https://cmmeaztwnfdbmqjfypaw.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase > Project Settings > API Keys > service_role / secret key (keep it secret)
   - `ADMIN_PASSWORD` = a password for `/admin`
   - `SITE_URL` = your Vercel address, e.g. `https://delivery-lyon.vercel.app` (set it after the first deploy, then redeploy)
3. Open `/book`, send a test request, then open `/admin` (any username, your password). The request shows as `requested`.

## How it runs without Stripe

A booking is saved with status `requested`. You assign a rider in `/admin` and move it to `assigned`, then `delivered`. The customer pays the rider by Revolut, Lydia or cash. The rider page and admin list work the same either way.

## Adding Stripe later

Add `STRIPE_SECRET_KEY` (test key first) and `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy. The booking page switches itself to card payment. Create the webhook in Stripe at `https://YOUR-SITE/api/webhook` for the event `checkout.session.completed`. Test card: `4242 4242 4242 4242`.

Stripe fees are roughly 1.5% + €0.25 per European card payment, about €0.29 on a €2.50 parcel. Your 25% commission on that parcel is about €0.63.

## Things to fill in before you share it widely

- A team contact email in `app/legal/page.js`.
- Check the delivery slots in `lib/services.js` and the answers in `app/faq/page.js` match what you can actually do.
- Have your tutor read `/legal` before charging real money.

## Not built yet

Monthly €9.99 plan (Stripe Billing), automatic rider payouts (Stripe Connect), confirmation emails, rider login, delivery photos.
