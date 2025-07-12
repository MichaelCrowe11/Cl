"use client";

import * as React from "react";
import { SearchInput } from "@/components/ui/search-input";

export function ProtocolSearchDemo() {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = React.useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Searching for:", searchTerm);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClear = React.useCallback(() => {
    setQuery("");
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!query.trim()) return;

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  return (
    <div className="w-full max-w-md space-y-4">
      <SearchInput
        id="protocol-search"
        placeholder="Ask about cultivation, contamination, protocols…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={handleClear}
        isLoading={isLoading}
        aria-describedby="search-help"
      />
      
      <p id="search-help" className="text-xs text-muted-foreground">
        Search across protocols, SOPs, and knowledge base
      </p>
      
      {query && (
        <div className="text-sm text-muted-foreground">
          Searching for: <span className="font-medium">{query}</span>
        </div>
      )}
    </div>
  );
}

export default ProtocolSearchDemo;
