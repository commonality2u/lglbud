"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed w-full bg-white dark:bg-gray-900 shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Legal Buddy
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/features" active={isActive('/features')}>
              Features
            </NavLink>
            <NavLink href="/pricing" active={isActive('/pricing')}>
              Pricing
            </NavLink>
            <NavLink href="/about" active={isActive('/about')}>
              About
            </NavLink>
            <NavLink href="/contact" active={isActive('/contact')}>
              Contact
            </NavLink>
          </div>

          {/* Right Side - Auth & Theme */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMobileMenu}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink
              href="/features"
              active={isActive('/features')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </MobileNavLink>
            <MobileNavLink
              href="/pricing"
              active={isActive('/pricing')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </MobileNavLink>
            <MobileNavLink
              href="/about"
              active={isActive('/about')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </MobileNavLink>
            <MobileNavLink
              href="/contact"
              active={isActive('/contact')}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 space-y-1">
              <MobileNavLink
                href="/login"
                active={false}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </MobileNavLink>
              <Link
                href="/signup"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${
        active
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
      } font-medium transition-colors`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children, onClick }: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        active
          ? 'bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
    >
      {children}
    </Link>
  );
}
