'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main className="flex-1 overflow-auto md:pl-64">
        {/* Mobile hamburger button and logo */}
        <div className="md:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <img
            src="/Images/Logo.jpeg"
            alt="Al-Qaswa Marine Logo"
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>
        {children}
      </main>
    </div>
  );
}
