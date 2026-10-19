export const metadata = { title: 'FAQ | Student Delivery Lyon' };

const QA = [
  ['Who are the riders?', 'Students from Lyon schools. We contact every rider before the first job and keep a record of who delivered what.'],
  ['How do I pay?', 'You pay your rider at delivery by Revolut, Lydia or cash, unless online card payment is switched on.'],
  ['Can a rider collect my parcel from a relay shop?', 'Usually yes, with your permission. Most relay shops let a named person collect a parcel if you authorise them online. Some ask to see a photo of your ID. We never keep a copy after delivery.'],
  ['What are the delivery slots?', 'Fixed evening slots on Tuesday and Friday, and Saturday morning. You pick one when you book. Need another time? Write it in the notes and we will try.'],
  ['What if my parcel is damaged or lost?', 'Tell us within 24 hours with a photo. During this test phase we will refund the delivery fee and help you with the sender. Do not use us for items worth more than €150 yet.'],
  ['Can I do a move with you?', 'Small moves only: up to 8 boxes or a few items, with a cargo bike or a car. Describe what you have in the notes.'],
  ['I want to be a rider. How much do I earn?', 'About €12 per hour in the plan. You choose your hours. Apply on the rider page and we will contact you.'],
  ['Where do you operate?', 'Lyon and the nearby student areas. Write your address and we will tell you if it works.'],
];

export default function Faq() {
  return (
    <>
      <h1>Questions</h1>
      {QA.map(([q, a]) => (
        <div className="card" key={q} style={{ marginBottom: 12 }}>
          <b style={{ fontSize: 17 }}>{q}</b>
          <p style={{ margin: '6px 0 0' }}>{a}</p>
        </div>
      ))}
      <p><a className="btn" href="/book">Book a delivery</a></p>
    </>
  );
}
