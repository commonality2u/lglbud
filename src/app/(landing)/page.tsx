import Link from 'next/link';
import { 
  ArrowRight, 
  Scale, 
  Shield, 
  Clock, 
  Users,
  FileText,
  BookOpen,
  Calendar,
  BarChart
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your Legal Journey Made
            <span className="text-blue-600 dark:text-blue-400"> Simple</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Navigate the legal system with confidence. Legal Buddy provides intelligent guidance
            for both pro se litigants and attorneys.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Get Started
              <ArrowRight className="inline-block ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Legal Buddy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Smart Legal Guidance"
              description="Step-by-step guidance through legal processes with intelligent document assembly."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Secure & Confidential"
              description="Bank-level security to protect your sensitive legal information."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Time-Saving Tools"
              description="Automated document preparation and deadline tracking to keep you on schedule."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
              title="Expert Support"
              description="Access to legal resources and professional support when needed."
            />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Comprehensive Legal Tools
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Everything you need to manage your legal matters efficiently in one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ToolCard
              icon={<FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Document Assembly"
              features={[
                "Smart form filling",
                "Template library",
                "E-signature support",
                "Version control"
              ]}
            />
            <ToolCard
              icon={<Calendar className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Case Management"
              features={[
                "Deadline tracking",
                "Court date calendar",
                "Task management",
                "Automated reminders"
              ]}
            />
            <ToolCard
              icon={<BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />}
              title="Learning Center"
              features={[
                "Interactive tutorials",
                "Legal guides",
                "Process flowcharts",
                "Practice resources"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="50K+" label="Users" />
            <StatCard number="100K+" label="Documents Created" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Legal Journey?
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust Legal Buddy for their legal needs.
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-semibold border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function ToolCard({ icon, title, features }: {
  icon: React.ReactNode;
  title: string;
  features: string[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center text-white">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
} 