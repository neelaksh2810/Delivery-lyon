import { NextResponse } from 'next/server';
import { db } from '../../../lib/supabase';
import { SERVICES, SLOTS } from '../../../lib/services';

export const runtime = 'nodejs';

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Two modes:
// - STRIPE_SECRET_KEY set: the customer pays online through Stripe Checkout.
// - not set: the request is saved and the customer pays the rider (Revolut, Lydia or cash).
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const service = SERVICES[body.service_type];
  if (!service) return NextResponse.json({ error: 'Unknown service' }, { status: 400 });

  const online = Boolean(process.env.STRIPE_SECRET_KEY);
  const row = {
    service_type: body.service_type,
    customer_name: clean(body.customer_name, 120),
    customer_email: clean(body.customer_email, 200),
    customer_phone: clean(body.customer_phone, 40),
    relay_shop: clean(body.relay_shop, 200) || null,
    residence: clean(body.residence, 200) || null,
    pickup_address: clean(body.pickup_address, 200) || null,
    dropoff_address: clean(body.dropoff_address, 200) || null,
    slot: clean(body.slot, 80),
    notes: clean(body.notes, 600) || null,
    price_cents: service.price, // always set on the server
    status: online ? 'pending_payment' : 'requested',
  };

  if (!row.customer_name || !row.customer_phone || !EMAIL.test(row.customer_email) || !SLOTS.includes(row.slot)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email, your phone and a time slot.' }, { status: 400 });
  }
  if (service.needs === 'relay' ? !(row.relay_shop && row.residence) : !(row.pickup_address && row.dropoff_address)) {
    return NextResponse.json({ error: 'Please fill in the addresses.' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: 'Please accept the terms to continue.' }, { status: 400 });
  }

  try {
    const supabase = db();
    const { data: created, error } = await supabase.from('delivery_requests').insert(row).select('id').single();
    if (error) throw error;

    const site = process.env.SITE_URL || new URL(req.url).origin;
    if (!online) return NextResponse.json({ url: `${site}/success?mode=manual` });

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: row.customer_email,
      line_items: [{
        quantity: 1,
        price_data: { currency: 'eur', unit_amount: service.price, product_data: { name: service.label } },
      }],
      metadata: { request_id: created.id },
      success_url: `${site}/success`,
      cancel_url: `${site}/book`,
    });

    await supabase.from('delivery_requests').update({ stripe_session_id: session.id }).eq('id', created.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('checkout failed', err);
    return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 });
  }
}
