import { 
  Users, 
  Shield, 
  Scale, 
  Globe, 
  Award,
  Briefcase,
  BookOpen,
  Heart
} from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">
            Transforming Legal Technology
            <span className="block text-blue-600 dark:text-blue-400">For Everyone</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to democratize access to legal services through innovative
            technology and user-centric design.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="mb-6 text-blue-600 dark:text-blue-400">
                <Globe className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300">
                To make legal services accessible, efficient, and transparent through innovative
                technology solutions that empower both legal professionals and individuals seeking
                legal assistance.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <div className="mb-6 text-blue-600 dark:text-blue-400">
                <Award className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300">
                To create a world where quality legal services are accessible to everyone,
                regardless of their background or resources, through the power of technology
                and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Shield className="h-8 w-8" />}
              title="Trust & Security"
              description="We prioritize the security and confidentiality of our users' data above all else."
            />
            <ValueCard
              icon={<Users className="h-8 w-8" />}
              title="User-Centric"
              description="Every feature we build starts with understanding our users' needs and challenges."
            />
            <ValueCard
              icon={<Scale className="h-8 w-8" />}
              title="Justice for All"
              description="We believe everyone deserves access to quality legal services and support."
            />
            <ValueCard
              icon={<Heart className="h-8 w-8" />}
              title="Community Impact"
              description="We're committed to making a positive impact in the legal community and society."
            />
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Sarah Chen"
              title="Chief Executive Officer"
              bio="Former technology executive with 15+ years experience in legal tech and AI."
              image="/team/sarah.jpg"
            />
            <TeamMember
              name="Michael Rodriguez"
              title="Chief Technology Officer"
              bio="20+ years in software development, specializing in AI and machine learning."
              image="/team/michael.jpg"
            />
            <TeamMember
              name="David Kim"
              title="Chief Legal Officer"
              bio="Former partner at a top law firm with expertise in legal technology and innovation."
              image="/team/david.jpg"
            />
            <TeamMember
              name="Emily Thompson"
              title="Head of Product"
              bio="Product leader with experience at leading legal tech companies."
              image="/team/emily.jpg"
            />
            <TeamMember
              name="James Wilson"
              title="Head of Customer Success"
              bio="Dedicated to ensuring our customers achieve their goals through our platform."
              image="/team/james.jpg"
            />
            <TeamMember
              name="Lisa Patel"
              title="Head of Operations"
              bio="Operations expert with a track record of scaling legal tech startups."
              image="/team/lisa.jpg"
            />
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard number="2018" label="Founded" />
            <StatCard number="100+" label="Team Members" />
            <StatCard number="50K+" label="Users Worldwide" />
            <StatCard number="30+" label="Countries" />
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            We're always looking for talented individuals who share our passion for
            making legal services accessible to everyone.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/careers"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, description }: {
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

function TeamMember({ name, title, bio, image }: {
  name: string;
  title: string;
  bio: string;
  image: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
        {/* Note: In production, replace with actual team member images */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-blue-600 dark:text-blue-400 mb-2">{title}</p>
        <p className="text-gray-600 dark:text-gray-300">{bio}</p>
      </div>
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