import { 
  FileText, 
  Calendar, 
  BookOpen, 
  BarChart, 
  Shield, 
  Users, 
  Scale,
  Clock,
  Brain,
  Gavel,
  Database,
  Cloud
} from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">
            Comprehensive Legal Technology
            <span className="block text-blue-600 dark:text-blue-400">Built for the Future</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Discover how Legal Buddy combines advanced technology with legal expertise to deliver
            a comprehensive solution for modern legal professionals and self-represented litigants.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Core Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI-Powered Document Analysis"
              description="Advanced machine learning algorithms analyze legal documents, extract key information, and provide intelligent insights."
              features={[
                "Smart document parsing",
                "Key clause identification",
                "Risk assessment",
                "Citation verification"
              ]}
            />
            <FeatureCard
              icon={<Scale className="h-8 w-8" />}
              title="Case Management System"
              description="Comprehensive case tracking and management system designed for both law firms and individual users."
              features={[
                "Timeline tracking",
                "Party management",
                "Evidence tracking",
                "Automated reminders"
              ]}
            />
            <FeatureCard
              icon={<Gavel className="h-8 w-8" />}
              title="Legal Process Automation"
              description="Streamline repetitive legal tasks and workflows with intelligent automation."
              features={[
                "Document assembly",
                "Court filing automation",
                "Deadline calculations",
                "Form generation"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Enterprise-Grade Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TechCard
              icon={<Shield className="h-8 w-8" />}
              title="Security First"
              description="Bank-level encryption, SOC 2 compliance, and regular security audits ensure your data is protected."
            />
            <TechCard
              icon={<Database className="h-8 w-8" />}
              title="Scalable Infrastructure"
              description="Built on modern cloud architecture to handle millions of documents and users."
            />
            <TechCard
              icon={<Cloud className="h-8 w-8" />}
              title="Cloud Native"
              description="Leveraging cutting-edge cloud technologies for reliability and performance."
            />
            <TechCard
              icon={<Users className="h-8 w-8" />}
              title="Enterprise Ready"
              description="Built for organizations of all sizes with robust admin controls and analytics."
            />
          </div>
        </div>
      </section>

      {/* Integration Ecosystem */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Integration Ecosystem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <IntegrationCard
              title="Court Systems"
              description="Direct integration with electronic court filing systems across multiple jurisdictions."
              integrations={[
                "Federal Court e-filing",
                "State Court Systems",
                "Electronic Service",
                "Court Calendar Sync"
              ]}
            />
            <IntegrationCard
              title="Practice Management"
              description="Seamless integration with popular legal practice management software."
              integrations={[
                "Clio",
                "MyCase",
                "PracticePanther",
                "Legal Files"
              ]}
            />
            <IntegrationCard
              title="Document Management"
              description="Connect with leading document management and storage solutions."
              integrations={[
                "iManage",
                "NetDocuments",
                "SharePoint",
                "Google Workspace"
              ]}
            />
            <IntegrationCard
              title="Communication"
              description="Integrate with your existing communication and collaboration tools."
              integrations={[
                "Microsoft Teams",
                "Slack",
                "Zoom",
                "Email Systems"
              ]}
            />
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Proven Results
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="60%" label="Time Saved on Document Preparation" />
            <StatCard number="45%" label="Reduction in Filing Errors" />
            <StatCard number="80%" label="Faster Case Processing" />
            <StatCard number="3x" label="ROI for Law Firms" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
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

function TechCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

function IntegrationCard({ title, description, integrations }: {
  title: string;
  description: string;
  integrations: string[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {integrations.map((integration, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {integration}
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