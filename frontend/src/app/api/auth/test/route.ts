import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    test_email: process.env.TEST_USER_EMAIL,
    nextauth_url: process.env.NEXTAUTH_URL,
    has_secret: !!process.env.NEXTAUTH_SECRET,
  });
} 