"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  showClearButton?: boolean;
  isLoading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ 
    className, 
    type = "search", 
    onClear, 
    showClearButton = true,
    isLoading = false,
    value,
    onChange,
    ...props 
  }, ref) => {
    const hasValue = value && value.toString().length > 0;

    return (
      <div className="relative">
        {/* Accessible label */}
        <label htmlFor={props.id} className="sr-only">
          {props.placeholder || "Search"}
        </label>
        
        {/* Search icon */}
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        
        {/* Input field */}
        <input
          type={type}
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            // Base styling
            "flex h-10 w-full rounded-md border border-input bg-background",
            "pl-10 pr-10 py-2 text-sm", // Space for icons
            
            // Placeholder and focus states
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-2 ring-offset-background",
            
            // Disabled state
            "disabled:cursor-not-allowed disabled:opacity-50",
            
            // Loading state
            isLoading && "cursor-wait",
            
            className
          )}
          {...props}
        />
        
        {/* Clear button */}
        {showClearButton && hasValue && !isLoading && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 
                       text-muted-foreground hover:text-foreground
                       focus-visible:outline-none focus-visible:ring-1 
                       focus-visible:ring-ring rounded-sm"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
