"use client";

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock,
  Building,
  Send
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl md:text-6xl">
            Get in Touch
            <span className="block text-blue-600 dark:text-blue-400">We're Here to Help</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions about Legal Buddy? Our team is ready to help you find the perfect solution
            for your legal practice.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactMethod
              icon={<Phone className="h-6 w-6" />}
              title="Phone Support"
              description="Mon-Fri, 9am-6pm EST"
              contact="+1 (888) 123-4567"
            />
            <ContactMethod
              icon={<Mail className="h-6 w-6" />}
              title="Email Support"
              description="24/7 Response Time"
              contact="support@legalbuddy.com"
            />
            <ContactMethod
              icon={<MessageSquare className="h-6 w-6" />}
              title="Live Chat"
              description="Available 24/7"
              contact="Start Chat"
            />
          </div>
        </div>
      </section>

      {/* Contact Form & Office Locations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Office Locations */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Our Offices
              </h2>
              <div className="space-y-8">
                <OfficeLocation
                  city="San Francisco"
                  address="100 Market Street, Suite 300, San Francisco, CA 94105"
                  hours="9:00 AM - 6:00 PM PST"
                  phone="+1 (415) 555-0123"
                />
                <OfficeLocation
                  city="New York"
                  address="350 Fifth Avenue, 21st Floor, New York, NY 10118"
                  hours="9:00 AM - 6:00 PM EST"
                  phone="+1 (212) 555-0123"
                />
                <OfficeLocation
                  city="London"
                  address="1 Canada Square, Canary Wharf, London E14 5AB, UK"
                  hours="9:00 AM - 6:00 PM GMT"
                  phone="+44 20 7123 4567"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Global Support Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SupportHours
              region="Americas"
              hours="24/7 Support"
              description="Full coverage across North and South America"
            />
            <SupportHours
              region="Europe & Africa"
              hours="24/7 Support"
              description="Supporting EMEA region with local teams"
            />
            <SupportHours
              region="Asia Pacific"
              hours="24/7 Support"
              description="Coverage across APAC with regional support"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactMethod({ icon, title, description, contact }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  contact: string;
}) {
  return (
    <div className="flex items-start p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">{description}</p>
        <p className="text-blue-600 dark:text-blue-400 font-medium">{contact}</p>
      </div>
    </div>
  );
}

function OfficeLocation({ city, address, hours, phone }: {
  city: string;
  address: string;
  hours: string;
  phone: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        <Building className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{city}</h3>
      </div>
      <div className="space-y-3 text-sm">
        <p className="flex items-start text-gray-600 dark:text-gray-300">
          <MapPin className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
          {address}
        </p>
        <p className="flex items-center text-gray-600 dark:text-gray-300">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          {hours}
        </p>
        <p className="flex items-center text-gray-600 dark:text-gray-300">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          {phone}
        </p>
      </div>
    </div>
  );
}

function SupportHours({ region, hours, description }: {
  region: string;
  hours: string;
  description: string;
}) {
  return (
    <div className="text-center text-white">
      <h3 className="text-xl font-semibold mb-2">{region}</h3>
      <p className="text-blue-100 font-medium mb-2">{hours}</p>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  );
} 