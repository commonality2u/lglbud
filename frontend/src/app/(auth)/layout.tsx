"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Simple auth check - redirect to dashboard if already logged in
  useEffect(() => {
    // TODO: Replace with actual auth check
    const isLoggedIn = false; // This would be from your auth state
    if (isLoggedIn) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth pages (login/signup) will be rendered here */}
      {children}
    </div>
  );
} 