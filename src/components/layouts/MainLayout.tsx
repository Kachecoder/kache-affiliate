/**
 * Main layout component for the application
 * 
 * This component provides the overall layout structure for the application,
 * including navigation, sidebar, and main content area.
 */

import React, { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const MainLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  
  // Navigation items
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'chart-pie' },
    { name: 'Data Scraping', path: '/scraping', icon: 'database' },
    { name: 'Trend Research', path: '/trends', icon: 'chart-line' },
    { name: 'Competitor Analysis', path: '/competitors', icon: 'users' },
    { name: 'Marketing Strategy', path: '/strategy', icon: 'lightbulb' },
    { name: 'Settings', path: '/settings', icon: 'cog' },
  ];
  
  // Check if a nav item is active
  const isActive = (path: string) => router.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for larger screens */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block">
        <div className="px-6 py-4">
          <Link href="/">
            <span className="text-2xl font-bold text-primary-600">Kache Affiliate</span>
          </Link>
        </div>
        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center px-4 py-3 mt-2 text-gray-600 rounded-lg ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mx-4">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
        sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
      }`} onClick={() => setSidebarOpen(false)}></div>
      
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transition-transform transform md:hidden ${
        sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'
      }`}>
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-primary-600">Kache Affiliate</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6 px-3">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center px-4 py-3 mt-2 text-gray-600 rounded-lg ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                  : 'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mx-4">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center md:hidden">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                {/* Add user profile, notifications, etc. here */}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
