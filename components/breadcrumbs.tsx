"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbsProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export function Breadcrumbs({ className, customItems }: BreadcrumbsProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: Home }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Special cases for known routes
      switch (segment) {
        case 'ide-pro':
          label = 'Professional IDE';
          break;
        case 'crowe-logic':
          label = 'Crowe Logic';
          break;
        case 'platform':
          label = 'Lab Platform';
          break;
        case 'chat':
          label = 'AI Assistant';
          break;
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
    >
      <ol className="flex items-center space-x-1" role="list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight 
                  className="h-4 w-4 mx-1 text-muted-foreground/50" 
                  aria-hidden="true" 
                />
              )}
              
              {isLast ? (
                <span 
                  className="flex items-center font-medium text-foreground"
                  aria-current="page"
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" aria-hidden="true" />}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center hover:text-foreground transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1"
                  )}
                  aria-label={`Go to ${item.label}`}
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
