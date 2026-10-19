// Single source of truth for services and prices (in euro cents).
// Prices come from the project plan. The server always recomputes the price from the service key,
// so a visitor cannot change what they pay by editing the form.
export const SERVICES = {
  parcel_residence: { label: 'Parcel pickup from a relay shop, dropped at your residence', price: 250, needs: 'relay' },
  delivery_short: { label: 'Person-to-person delivery, under 2 km', price: 400, needs: 'route' },
  delivery_mid: { label: 'Person-to-person delivery, 2 to 5 km', price: 600, needs: 'route' },
  delivery_long: { label: 'Person-to-person delivery, over 5 km', price: 800, needs: 'route' },
  leboncoin_small: { label: 'Leboncoin pickup, small item', price: 1500, needs: 'route' },
  leboncoin_large: { label: 'Leboncoin pickup, large item', price: 2000, needs: 'route' },
  move_small: { label: 'Small move, up to 8 boxes', price: 4000, needs: 'route' },
  move_large: { label: 'Small move, bigger load', price: 6000, needs: 'route' },
};

export const SLOTS = [
  'Tuesday 18:00 to 20:00',
  'Friday 18:00 to 20:00',
  'Saturday 10:00 to 12:00',
  'Other time (write it in the notes)',
];

export const euro = (cents) => `€${(cents / 100).toFixed(2)}`;
