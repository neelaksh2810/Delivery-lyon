import { SERVICES, euro } from '../lib/services';

export default function Home() {
  const rows = [
    ['parcel_residence', 'Parcel from a relay shop to your residence'],
    ['delivery_short', 'Delivery between students, under 2 km'],
    ['leboncoin_small', 'Leboncoin pickup, small item'],
    ['move_small', 'Small move, up to 8 boxes'],
  ];
  return (
    <>
      <h1>Missed your parcel? A student will bring it.</h1>
      <p className="lead">
        Fixed evening slots, trusted student riders, and a price you see before you pay. Parcels, second-hand pickups and small moves in Lyon.
      </p>
      <p>
        <a className="btn" href="/book">Book a delivery</a>{' '}
        <a className="btn alt" href="/ride">Earn as a rider</a>
      </p>

      <h2>Prices</h2>
      <div className="grid">
        {rows.map(([key, label]) => (
          <div className="card" key={key}>
            <b>{euro(SERVICES[key].price)}</b>
            <span className="muted">{label}</span>
          </div>
        ))}
      </div>

      <h2>How it works</h2>
      <div className="grid">
        <div className="card"><b>1. Book</b><span className="muted">Pick the service, your slot and pay online.</span></div>
        <div className="card"><b>2. A rider is assigned</b><span className="muted">We confirm by email or WhatsApp.</span></div>
        <div className="card"><b>3. Delivered</b><span className="muted">The rider brings it at your slot and sends a photo.</span></div>
      </div>
      <p className="muted" style={{ marginTop: 32 }}>A student project from emlyon business school.</p>
    </>
  );
}
