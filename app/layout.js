import './globals.css';

export const metadata = {
  title: 'Student Delivery Lyon',
  description: 'Students in Lyon collect and deliver parcels, second-hand items and small moves for other students.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <header className="site">
            <b><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Student Delivery Lyon</a></b>
            <nav>
              <a href="/book">Book a delivery</a>
              <a href="/ride">Become a rider</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
