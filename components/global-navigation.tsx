'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Terminal, Leaf, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalNavigationProps {
  className?: string;
}

export function GlobalNavigation({ className }: GlobalNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Pro IDE', href: '/crowe-logic-pro', icon: Terminal },
    { name: 'Mycological IDE', href: '/farm-management', icon: Leaf },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className={cn("fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/crowelogic-avatar.png" 
                alt="Crowe Logic"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Crowe Logic AI</h1>
              </div>
            </Link>
          
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-all",
                      isActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default GlobalNavigation;
