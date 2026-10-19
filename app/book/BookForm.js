'use client';
import { useState } from 'react';
import { SERVICES, SLOTS, euro } from '../../lib/services';

export default function BookForm({ online }) {
  const [service, setService] = useState('parcel_residence');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isRelay = SERVICES[service].needs === 'relay';

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.consent = fd.get('consent') === 'on';
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, service_type: service }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || 'Something went wrong. Please try again.');
      window.location.href = json.url;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Service
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {Object.entries(SERVICES).map(([key, s]) => (
            <option key={key} value={key}>{s.label} ({euro(s.price)})</option>
          ))}
        </select>
      </label>

      {isRelay ? (
        <>
          <label>Relay shop (name and address)<input name="relay_shop" required maxLength={200} /></label>
          <label>Your residence and room number<input name="residence" required maxLength={200} /></label>
        </>
      ) : (
        <>
          <label>Pickup address<input name="pickup_address" required maxLength={200} /></label>
          <label>Drop-off address<input name="dropoff_address" required maxLength={200} /></label>
        </>
      )}

      <label>
        Time slot
        <select name="slot" required>
          {SLOTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Your name<input name="customer_name" required maxLength={120} autoComplete="name" /></label>
      <label>Email<input name="customer_email" type="email" required maxLength={200} autoComplete="email" /></label>
      <label>Phone or WhatsApp<input name="customer_phone" required maxLength={40} autoComplete="tel" /></label>
      <label>Notes (parcel name, order number, anything useful)<textarea name="notes" rows={3} maxLength={600} /></label>

      {isRelay && (
        <p className="muted">
          Most relay shops need your permission for a rider to collect the parcel. We will tell you how to give it after you book. You may need to show a photo of your ID to the relay shop. We never keep a copy after delivery.
        </p>
      )}

      <label className="check">
        <input type="checkbox" name="consent" required />
        <span>I accept the <a href="/legal" target="_blank">terms and privacy notice</a>.</span>
      </label>

      <div className="price">Total {euro(SERVICES[service].price)}</div>
      <p className="muted">
        {online
          ? 'You pay securely by card on the next page.'
          : 'No payment now. You pay your rider at delivery by Revolut, Lydia or cash. We confirm your slot first.'}
      </p>
      {error && <div className="err">{error}</div>}
      <button className="btn" disabled={busy}>
        {busy ? 'Sending…' : online ? 'Pay securely with Stripe' : 'Send my request'}
      </button>
    </form>
  );
}
