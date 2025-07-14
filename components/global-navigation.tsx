"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CroweLogo } from './crowe-logo';
import {
  Brain,
  FlaskConical,
  MessageSquare,
  Code2,
  Monitor,
  Terminal,
  Home,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  User,
  LogOut,
  Keyboard
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

interface GlobalNavigationProps {
  className?: string;
}

export function GlobalNavigation({ className }: GlobalNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      description: 'Crowe Logic AI Platform Landing Page'
    },
    {
      id: 'platform',
      label: 'Lab Platform',
      href: '/platform',
      icon: FlaskConical,
      description: 'Mycology Lab Management Dashboard',
      badge: 'Pro'
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      href: '/chat',
      icon: MessageSquare,
      description: 'AI-Powered Research Assistant'
    },
    {
      id: 'ide',
      label: 'Development Environment',
      href: '/ide-pro',
      icon: Code2,
      description: 'Professional IDE for Research',
      children: [
        {
          id: 'ide-basic',
          label: 'Basic IDE',
          href: '/ide',
          icon: Monitor,
          description: 'Basic Integrated Development Environment'
        },
        {
          id: 'ide-pro',
          label: 'Pro IDE',
          href: '/ide-pro',
          icon: Terminal,
          description: 'Professional IDE with Advanced Features',
          badge: 'New'
        }
      ]
    },
    {
      id: 'crowe-logic',
      label: 'Crowe Logic',
      href: '/crowe-logic',
      icon: Brain,
      description: 'Advanced AI Logic System'
    }
  ];

  const flattenedItems = navigationItems.reduce((acc: NavigationItem[], item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...item.children);
    }
    return acc;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Escape' || (e.ctrlKey && e.key === 'k')) {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < flattenedItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : flattenedItems.length - 1
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0) {
            const item = flattenedItems[focusedIndex];
            window.location.href = item.href;
          }
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, flattenedItems.length, showKeyboardShortcuts]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.href);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
              aria-expanded={isExpanded}
              aria-controls={`submenu-${item.id}`}
            >
              <div className="flex items-center">
                <Icon className="h-4 w-4 mr-3" aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                    {item.badge}
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isActive && "bg-accent text-accent-foreground font-medium"
              )}
              onClick={() => setIsOpen(false)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 mr-3" aria-hidden="true" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div id={`submenu-${item.id}`} className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Navigation toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-md transition-colors",
          "bg-background border border-border shadow-lg",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        aria-expanded={isOpen}
        aria-controls="global-navigation"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        title="Navigation (Ctrl+K)"
      >
        {isOpen ? (
          <X className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Menu className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {/* Navigation overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation panel */}
      <div
        ref={menuRef}
        id="global-navigation"
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-80 bg-background border-r border-border shadow-xl",
          "transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Global navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <CroweLogo className="h-8 w-8" />
            <div>
              <h2 className="text-lg font-semibold">Crowe Logic AI</h2>
              <p className="text-xs text-muted-foreground">Professional Platform</p>
            </div>
          </div>
          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="p-1 rounded hover:bg-accent"
            title="Keyboard shortcuts (?)"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto p-4" role="menu">
          <div className="space-y-2">
            {navigationItems.map(item => renderNavigationItem(item))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground text-center">
            <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd> to open navigation</p>
            <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">?</kbd> for shortcuts</p>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts panel */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-1 rounded hover:bg-accent"
                aria-label="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Open/Close Navigation</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between">
                <span>Navigate Up/Down</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">↑/↓</kbd>
              </div>
              <div className="flex justify-between">
                <span>Select Item</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Close Menu</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span>Show Shortcuts</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalNavigation;
