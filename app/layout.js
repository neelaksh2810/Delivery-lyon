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
              <a href="/book">Book</a>
              <a href="/ride">Ride</a>
              <a href="/faq">FAQ</a>
            </nav>
          </header>
          {children}
          <footer className="muted" style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            A student project from emlyon business school. <a href="/legal">Terms and privacy</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
