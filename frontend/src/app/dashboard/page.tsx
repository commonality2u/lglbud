'use client';

import { 
  DocumentTextIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  FolderIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  className?: string;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}

interface DeadlineItemProps {
  title: string;
  subtitle: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export default function DashboardPage() {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FolderIcon className="h-6 w-6 text-blue-500" />}
          title="Active Cases"
          value="12"
          subtitle="+2 this month"
          className="bg-white dark:bg-gray-800"
        />
        <StatCard
          icon={<DocumentTextIcon className="h-6 w-6 text-yellow-500" />}
          title="Pending Documents"
          value="5"
          subtitle="3 urgent"
          className="bg-white dark:bg-gray-800"
        />
        <StatCard
          icon={<CalendarIcon className="h-6 w-6 text-red-500" />}
          title="Upcoming Deadlines"
          value="8"
          subtitle="Next: Tomorrow"
          className="bg-white dark:bg-gray-800"
        />
        <StatCard
          icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
          title="Tasks Completed"
          value="85%"
          subtitle="+10% from last week"
          className="bg-white dark:bg-gray-800"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                icon={<DocumentTextIcon className="h-5 w-5 text-blue-500" />}
                title="Document Updated"
                description="Motion for Summary Judgment.pdf"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<CalendarIcon className="h-5 w-5 text-purple-500" />}
                title="Court Date Scheduled"
                description="Initial Hearing - Case #123-45"
                time="Yesterday"
              />
              <ActivityItem
                icon={<ClockIcon className="h-5 w-5 text-yellow-500" />}
                title="Deadline Approaching"
                description="Response to Motion Due"
                time="In 3 days"
              />
              <ActivityItem
                icon={<ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
                title="Action Required"
                description="Document Review Pending"
                time="Today"
              />
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h2>
            <div className="space-y-4">
              <DeadlineItem
                title="File Response to Motion"
                subtitle="Smith vs. Johnson"
                date="Dec 15, 2023"
                priority="high"
              />
              <DeadlineItem
                title="Document Review"
                subtitle="Estate Planning - Williams"
                date="Dec 18, 2023"
                priority="medium"
              />
              <DeadlineItem
                title="Court Appearance"
                subtitle="Corporate Filing - TechCorp"
                date="Dec 20, 2023"
                priority="high"
              />
              <DeadlineItem
                title="Client Meeting"
                subtitle="Contract Review - StartupX"
                date="Dec 22, 2023"
                priority="low"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center">
        {icon}
        <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex-shrink-0">
        <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function DeadlineItem({ title, subtitle, date, priority }: DeadlineItemProps) {
  const priorityColors = {
    high: 'text-red-500 bg-red-50 dark:bg-red-500/10',
    medium: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10',
    low: 'text-green-500 bg-green-50 dark:bg-green-500/10'
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
          {priority}
        </span>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
}
