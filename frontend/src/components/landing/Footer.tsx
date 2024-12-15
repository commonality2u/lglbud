import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/features" className="text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-white">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-300 hover:text-white">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-300 hover:text-white">
                  User Guides
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-300 hover:text-white">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-300 hover:text-white">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security-policy" className="text-gray-300 hover:text-white">
                  Security Policy
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-300 hover:text-white">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Legal Buddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 