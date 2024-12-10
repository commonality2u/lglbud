"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import TopNavBar from '../navigation/TopNavBar';
import SideNav from '../navigation/SideNav';

// Helper function to determine if we're on a webapp page
function isWebAppPage(path: string): boolean {
  // Exclude landing pages
  if (path.startsWith('/(landing)')) {
    return false;
  }
  
  const webappPaths = ['/dashboard', '/cases', '/documents', '/calendar', '/learning', '/resources', '/network', '/financial', '/support', '/settings'];
  return webappPaths.some(p => path.startsWith(p));
}

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAppPage = isWebAppPage(pathname);
  // Set initial state to true and store in localStorage
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(() => {
    // Check localStorage first, default to true if not set
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sideNavExpanded');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });

  // Handle toggle with localStorage persistence
  const handleToggle = () => {
    const newState = !isSideNavExpanded;
    setIsSideNavExpanded(newState);
    localStorage.setItem('sideNavExpanded', String(newState));
  };

  // Protect routes - redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated' && isAppPage) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, isAppPage, router, pathname]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  // Only render layout for authenticated users
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavBar isAppPage={isAppPage} />
      {isAppPage && (
        <SideNav 
          isExpanded={isSideNavExpanded} 
          onToggle={handleToggle} 
        />
      )}
      <main 
        className={`
          min-h-[calc(100vh-4rem)]
          transition-all duration-300 ease-in-out
          ${isAppPage ? (isSideNavExpanded ? 'ml-64' : 'ml-16') : ''}
          pt-16
          z-0
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
