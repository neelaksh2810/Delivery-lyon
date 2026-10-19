'use client';
import { useState } from 'react';

export default function Ride() {
  const [state, setState] = useState('idle'); // idle | busy | done
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setState('busy');
    setError('');
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    data.has_cargo_bike = fd.get('has_cargo_bike') === 'on';
    try {
      const res = await fetch('/api/rider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
      setState('done');
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  }

  if (state === 'done') {
    return (
      <>
        <h1>Thanks, we got your application</h1>
        <p className="lead">We will contact you within a few days about the first deliveries.</p>
      </>
    );
  }

  return (
    <>
      <h1>Earn about €12 per hour as a rider</h1>
      <p className="lead">Choose your own hours and deliver for other students in Lyon.</p>
      <form onSubmit={submit}>
        <label>Full name<input name="full_name" required maxLength={120} autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required maxLength={200} autoComplete="email" /></label>
        <label>Phone or WhatsApp<input name="phone" required maxLength={40} autoComplete="tel" /></label>
        <label>School<input name="school" maxLength={120} /></label>
        <label>When are you usually free?<textarea name="availability" rows={3} maxLength={400} /></label>
        <label className="check"><input type="checkbox" name="has_cargo_bike" /> I have access to a bike or cargo bike</label>
        {error && <div className="err">{error}</div>}
        <button className="btn" disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Apply'}</button>
      </form>
    </>
  );
}
