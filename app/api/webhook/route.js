import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { db } from '../../../lib/supabase';

export const runtime = 'nodejs';

// Stripe calls this after a successful payment. The signature check proves the call is really from Stripe.
export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers.get('stripe-signature');
  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const id = session.metadata && session.metadata.request_id;
    if (id && session.payment_status === 'paid') {
      const { error } = await db().from('delivery_requests').update({ status: 'paid' }).eq('id', id).eq('status', 'pending_payment');
      if (error) {
        console.error('webhook update failed', error);
        return NextResponse.json({ error: 'db' }, { status: 500 }); // Stripe will retry
      }
    }
  }
  return NextResponse.json({ received: true });
}
