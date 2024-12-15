"use client";

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export interface TopNavBarProps {
  isAppPage: boolean;
}

export default function TopNavBar({ isAppPage }: TopNavBarProps) {
  const { data: session, status } = useSession();

  return (
    <Disclosure as="nav" className="fixed top-0 right-0 left-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href={status === 'authenticated' ? '/dashboard' : '/'} className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Legal Buddy
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {status === 'authenticated' && (
              <button
                type="button"
                className="rounded-full p-1.5
                           text-gray-500 dark:text-gray-400 
                           hover:bg-gray-100 dark:hover:bg-gray-800
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                           dark:focus:ring-offset-gray-900"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}

            {/* Profile dropdown */}
            {status === 'authenticated' && (
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex rounded-full bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-gray-800' : '',
                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-gray-800' : '',
                            'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-gray-800' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {status === 'unauthenticated' && (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
