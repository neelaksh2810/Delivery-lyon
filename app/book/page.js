import BookForm from './BookForm';

export const metadata = { title: 'Book a delivery | Student Delivery Lyon' };

export default function Book() {
  const online = Boolean(process.env.STRIPE_SECRET_KEY);
  return (
    <>
      <h1>Book a delivery</h1>
      <BookForm online={online} />
    </>
  );
}
