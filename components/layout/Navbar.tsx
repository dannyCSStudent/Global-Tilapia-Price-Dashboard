import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { Menu, X, Home, BarChart2, Bell, User, Sun, Moon, LucideIcon } from 'lucide-react';
import Image from 'next/image';

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, text }) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} className={`flex items-center p-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg' 
        : 'hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
    }`}>
      <Icon className="w-5 h-5" />
      <span className="ml-2 font-medium font-sans">{text}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image src="/logo.svg" alt="Tilapia Trends Logo" width={40} height={40} className="mr-2" />
              <span className="text-2xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                TilapiaTrends
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavItem href="/" icon={Home} text="Home" />
              <NavItem href="/dashboard" icon={BarChart2} text="Dashboard" />
              <NavItem href="/alerts" icon={Bell} text="Alerts" />
              <NavItem href="/profile" icon={User} text="Profile" />
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-sans"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 mr-2 font-sans"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white font-sans"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem href="/" icon={Home} text="Home" />
            <NavItem href="/dashboard" icon={BarChart2} text="Dashboard" />
            <NavItem href="/alerts" icon={Bell} text="Alerts" />
            <NavItem href="/profile" icon={User} text="Profile" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;