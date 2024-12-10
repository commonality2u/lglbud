"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Scale, 
  FileText, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings,
  FolderOpen,
  HelpCircle,
  DollarSign
} from 'lucide-react';

export interface SideNavProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export default function SideNav({ isExpanded, onToggle }: SideNavProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Scale size={20} />, label: 'Cases', href: '/cases' },
    { icon: <FileText size={20} />, label: 'Documents', href: '/documents' },
    { icon: <Calendar size={20} />, label: 'Calendar', href: '/calendar' },
    { icon: <BookOpen size={20} />, label: 'Learning Center', href: '/learning' },
    { icon: <FolderOpen size={20} />, label: 'Resources', href: '/resources' },
    { icon: <Users size={20} />, label: 'Network', href: '/network' },
    { icon: <DollarSign size={20} />, label: 'Financial', href: '/financial' },
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={20} />, label: 'Support', href: '/support' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  const NavLink = ({ item }: { item: { icon: React.ReactNode; label: string; href: string } }) => (
    <Link
      href={item.href}
      className={`
        flex items-center px-3 py-2.5 
        text-gray-700 dark:text-gray-200 
        rounded-lg 
        transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800 
        ${pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
        group
      `}
    >
      <span 
        className={`
          flex-shrink-0
          transition-colors duration-200
          ${pathname === item.href 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }
        `}
      >
        {item.icon}
      </span>
      {isExpanded && (
        <span 
          className={`
            ml-3 text-sm font-medium
            transition-all duration-300
            ${pathname === item.href 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-200'
            }
          `}
        >
          {item.label}
        </span>
      )}
    </Link>
  );

  return (
    <aside 
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)]
        bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-800 
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-64' : 'w-16'}
        z-40
      `}
    >
      <div className="flex flex-col h-full relative">
        {/* Main Menu */}
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <nav className="space-y-1">
            {bottomMenuItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 
                     bg-white dark:bg-gray-900 
                     border border-gray-200 dark:border-gray-800 
                     rounded-full p-1.5 
                     hover:bg-gray-50 dark:hover:bg-gray-800
                     shadow-sm
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                     z-50
                     cursor-pointer"
        >
          <svg
            className={`
              w-4 h-4 text-gray-500 dark:text-gray-400 
              transform transition-transform duration-300 
              ${isExpanded ? 'rotate-180' : ''}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
