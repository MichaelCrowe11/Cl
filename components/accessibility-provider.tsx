"use client";

import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

interface AccessibilityContextType {
  announceMessage: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocusTrap: (element: HTMLElement | null) => void;
  clearFocusTrap: () => void;
  skipToContent: () => void;
  isHighContrastMode: boolean;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const assertiveRegionRef = useRef<HTMLDivElement>(null);
  const focusTrapRef = useRef<HTMLElement | null>(null);

  // Load accessibility preferences from localStorage
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    
    if (savedHighContrast === 'true') {
      setIsHighContrastMode(true);
    }
    
    if (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize)) {
      setFontSize(savedFontSize as 'small' | 'medium' | 'large');
    }
  }, []);

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isHighContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${fontSize}`);
    
    localStorage.setItem('accessibility-high-contrast', isHighContrastMode.toString());
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [isHighContrastMode, fontSize]);

  // Focus trap management
  useEffect(() => {
    if (!focusTrapRef.current) return;

    const element = focusTrapRef.current;
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [focusTrapRef.current]);

  const announceMessage = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = priority === 'assertive' ? assertiveRegionRef.current : liveRegionRef.current;
    if (region) {
      region.textContent = message;
      // Clear the message after announcement
      setTimeout(() => {
        if (region) region.textContent = '';
      }, 1000);
    }
  };

  const setFocusTrap = (element: HTMLElement | null) => {
    focusTrapRef.current = element;
  };

  const clearFocusTrap = () => {
    focusTrapRef.current = null;
  };

  const skipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      announceMessage('Skipped to main content');
    }
  };

  const toggleHighContrast = () => {
    setIsHighContrastMode(!isHighContrastMode);
    announceMessage(
      isHighContrastMode ? 'High contrast mode disabled' : 'High contrast mode enabled'
    );
  };

  const value: AccessibilityContextType = {
    announceMessage,
    setFocusTrap,
    clearFocusTrap,
    skipToContent,
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize: (size: 'small' | 'medium' | 'large') => {
      setFontSize(size);
      announceMessage(`Font size changed to ${size}`);
    },
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* ARIA live regions for announcements */}
      <div
        ref={liveRegionRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        ref={assertiveRegionRef}
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
      
      {/* Accessibility controls */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-background border border-border rounded-lg shadow-lg p-2 space-y-2">
          <button
            onClick={toggleHighContrast}
            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-accent transition-colors"
            title={`${isHighContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
            aria-label={`${isHighContrastMode ? 'Disable' : 'Enable'} high contrast mode`}
          >
            <div className={`w-4 h-4 rounded ${isHighContrastMode ? 'bg-foreground' : 'bg-muted'}`} />
          </button>
          
          <div className="flex flex-col space-y-1">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => value.setFontSize(size)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  fontSize === size 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                title={`Set font size to ${size}`}
                aria-label={`Set font size to ${size}`}
              >
                {size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AccessibilityContext.Provider>
  );
}

export default AccessibilityProvider;
