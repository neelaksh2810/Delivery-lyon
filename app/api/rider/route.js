import { NextResponse } from 'next/server';
import { db } from '../../../lib/supabase';

export const runtime = 'nodejs';

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const row = {
    full_name: clean(body.full_name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 40),
    school: clean(body.school, 120) || null,
    availability: clean(body.availability, 400) || null,
    has_cargo_bike: body.has_cargo_bike === true,
  };
  if (!row.full_name || !row.phone || !EMAIL.test(row.email)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email and your phone.' }, { status: 400 });
  }

  const { error } = await db().from('rider_applications').insert(row);
  if (error) {
    console.error('rider insert failed', error);
    return NextResponse.json({ error: 'We could not save your application. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
