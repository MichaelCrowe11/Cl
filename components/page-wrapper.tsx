"use client";

import React, { useEffect } from 'react';
import { Breadcrumbs } from './breadcrumbs';
import { useAccessibility } from './accessibility-provider';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showBreadcrumbs?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageWrapper({
  children,
  title,
  description,
  className,
  showBreadcrumbs = true,
  maxWidth = 'full'
}: PageWrapperProps) {
  const { announceMessage } = useAccessibility();

  // Announce page navigation to screen readers
  useEffect(() => {
    if (title) {
      announceMessage(`Navigated to ${title}`, 'polite');
    }
  }, [title, announceMessage]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none'
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Page Header */}
      {(title || showBreadcrumbs) && (
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className={cn("mx-auto px-4 py-4", maxWidthClasses[maxWidth])}>
            {showBreadcrumbs && (
              <Breadcrumbs className="mb-2" />
            )}
            
            {title && (
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Page Content */}
      <div className={cn("mx-auto", maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </div>
  );
}

export default PageWrapper;
