import { NextResponse } from 'next/server';

// Protects /admin with HTTP Basic auth. Username is ignored, password is ADMIN_PASSWORD.
export function middleware(req) {
  const expected = process.env.ADMIN_PASSWORD;
  const header = req.headers.get('authorization') || '';
  if (expected && header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (password === expected) return NextResponse.next();
    } catch (e) {}
  }
  return new NextResponse('Admin login required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Student Delivery Lyon admin"' },
  });
}

export const config = { matcher: ['/admin/:path*'] };
