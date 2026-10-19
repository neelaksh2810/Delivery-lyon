export default function Success({ searchParams }) {
  const manual = searchParams && searchParams.mode === 'manual';
  return (
    <>
      <h1>{manual ? 'Request received' : 'Payment received'}</h1>
      <p className="lead">
        {manual
          ? 'Thank you. We will confirm your slot and your rider by email or WhatsApp. You pay the rider at delivery.'
          : 'Thank you. We are assigning a rider and will confirm by email or WhatsApp shortly.'}
      </p>
      <a className="btn alt" href="/">Back to home</a>
    </>
  );
}
