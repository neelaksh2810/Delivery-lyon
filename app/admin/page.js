import { revalidatePath } from 'next/cache';
import { db } from '../../lib/supabase';
import { SERVICES, euro } from '../../lib/services';

export const dynamic = 'force-dynamic';

const STATUSES = ['pending_payment', 'paid', 'assigned', 'delivered', 'cancelled'];

// Server action. The /admin route is already behind the password in middleware.js.
async function update(formData) {
  'use server';
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  const rider = String(formData.get('rider_name') || '').trim().slice(0, 120);
  if (!id || !STATUSES.includes(status)) return;
  await db().from('delivery_requests').update({ status, rider_name: rider || null }).eq('id', id);
  revalidatePath('/admin');
}

export default async function Admin() {
  const supabase = db();
  const [{ data: requests }, { data: riders }] = await Promise.all([
    supabase.from('delivery_requests').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('rider_applications').select('*').order('created_at', { ascending: false }).limit(200),
  ]);

  const paid = (requests || []).filter((r) => ['paid', 'assigned', 'delivered'].includes(r.status));
  const revenue = paid.reduce((sum, r) => sum + r.price_cents, 0);

  return (
    <>
      <h1>Admin</h1>
      <p className="muted">
        {paid.length} paid requests, {euro(revenue)} collected, estimated 25% commission {euro(Math.round(revenue * 0.25))}.
      </p>

      <h2>Delivery requests</h2>
      <div className="scroll">
        <table>
          <thead><tr><th>When</th><th>Service</th><th>Customer</th><th>Where</th><th>Slot</th><th>Status and rider</th></tr></thead>
          <tbody>
            {(requests || []).map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</td>
                <td>{SERVICES[r.service_type]?.label || r.service_type}<br />{euro(r.price_cents)}</td>
                <td>{r.customer_name}<br />{r.customer_email}<br />{r.customer_phone}</td>
                <td>
                  {r.relay_shop ? `${r.relay_shop} → ${r.residence}` : `${r.pickup_address} → ${r.dropoff_address}`}
                  {r.notes ? <><br /><span className="muted">{r.notes}</span></> : null}
                </td>
                <td>{r.slot}</td>
                <td>
                  <form action={update} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <input name="rider_name" placeholder="Rider" defaultValue={r.rider_name || ''} style={{ width: 110 }} />
                    <button className="btn alt" style={{ padding: '6px 12px' }}>Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Rider applications</h2>
      <div className="scroll">
        <table>
          <thead><tr><th>When</th><th>Name</th><th>Contact</th><th>School</th><th>Free</th><th>Bike</th></tr></thead>
          <tbody>
            {(riders || []).map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</td>
                <td>{r.full_name}</td>
                <td>{r.email}<br />{r.phone}</td>
                <td>{r.school}</td>
                <td>{r.availability}</td>
                <td>{r.has_cargo_bike ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
