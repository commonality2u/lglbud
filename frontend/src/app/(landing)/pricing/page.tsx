import { Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">
            Transparent Pricing
            <span className="block text-blue-600 dark:text-blue-400">For Every Scale</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Whether you're a solo practitioner,
            small firm, or large enterprise, we have you covered.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <PricingCard
              name="Basic"
              price="$49"
              description="Perfect for solo practitioners and small practices"
              features={[
                "Up to 25 cases",
                "Basic document automation",
                "Court calendar integration",
                "Email support",
                "Basic analytics"
              ]}
              cta="Start Free Trial"
              ctaLink="/signup"
              popular={false}
            />

            {/* Professional Plan */}
            <PricingCard
              name="Professional"
              price="$99"
              description="Ideal for growing law firms and legal departments"
              features={[
                "Up to 100 cases",
                "Advanced document automation",
                "Court e-filing integration",
                "Priority support",
                "Advanced analytics",
                "Client portal",
                "Custom templates"
              ]}
              cta="Start Free Trial"
              ctaLink="/signup"
              popular={true}
            />

            {/* Business Plan */}
            <PricingCard
              name="Business"
              price="$199"
              description="For established firms with multiple attorneys"
              features={[
                "Unlimited cases",
                "Full document automation",
                "Multi-court integration",
                "24/7 priority support",
                "Custom analytics",
                "White-labeled client portal",
                "API access",
                "Custom workflows"
              ]}
              cta="Start Free Trial"
              ctaLink="/signup"
              popular={false}
            />

            {/* Enterprise Plan */}
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="Tailored solutions for large organizations"
              features={[
                "Custom case limits",
                "Custom integrations",
                "Dedicated support team",
                "Custom development",
                "On-premise deployment",
                "SLA guarantees",
                "Training & onboarding",
                "Compliance packages"
              ]}
              cta="Contact Sales"
              ctaLink="/contact"
              popular={false}
            />
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-300">
              Customized solutions for organizations with complex requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <EnterpriseFeature
              title="Custom Development"
              description="Get custom features and integrations built specifically for your organization's needs."
            />
            <EnterpriseFeature
              title="Dedicated Support"
              description="24/7 dedicated support team with guaranteed response times and regular check-ins."
            />
            <EnterpriseFeature
              title="Security & Compliance"
              description="Enhanced security features and compliance packages for regulated industries."
            />
            <EnterpriseFeature
              title="Training & Onboarding"
              description="Comprehensive training programs and dedicated onboarding manager."
            />
            <EnterpriseFeature
              title="SLA Guarantees"
              description="Guaranteed uptime, performance, and support response times."
            />
            <EnterpriseFeature
              title="Data Control"
              description="Advanced data management, backup, and retention policies."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FaqItem
              question="Can I switch plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
            />
            <FaqItem
              question="Is there a free trial?"
              answer="Yes, all plans come with a 14-day free trial. No credit card required to start."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, ACH transfers, and wire transfers for enterprise customers."
            />
            <FaqItem
              question="Do you offer refunds?"
              answer="Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of legal professionals who trust Legal Buddy to streamline their practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent text-white rounded-lg font-semibold border border-white hover:bg-blue-700 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PricingCard({ name, price, description, features, cta, ctaLink, popular }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular: boolean;
}) {
  return (
    <div className={`p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition relative ${popular ? 'ring-2 ring-blue-600' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-tr-xl rounded-bl-xl text-sm font-medium">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
        {price !== "Custom" && <span className="text-gray-500 dark:text-gray-400">/month</span>}
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
            <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block w-full py-3 px-4 text-center rounded-lg font-semibold transition ${
          popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function EnterpriseFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-start">
        <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{question}</h4>
          <p className="text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      </div>
    </div>
  );
} 