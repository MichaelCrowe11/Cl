'use client';

import React, { useState } from 'react';
import { Book, X, Minimize2, Maximize2 } from 'lucide-react';
import { RAGChatInterface } from './rag-chat-interface';

interface RAGIntegrationProps {
  className?: string;
  initialOpen?: boolean;
}

export const RAGIntegration: React.FC<RAGIntegrationProps> = ({
  className = '',
  initialOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50 ${className}`}
        title="Open Knowledge Assistant"
      >
        <Book className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className={`bg-white border border-gray-200 rounded-lg shadow-2xl transition-all duration-200 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
          <div className="flex items-center">
            <Book className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-semibold text-gray-900">Knowledge Assistant</span>
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              RAG
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="h-[calc(100%-64px)]">
            <RAGChatInterface 
              className="h-full border-0 rounded-none"
            />
          </div>
        )}

        {isMinimized && (
          <div className="p-3 text-center text-sm text-gray-600">
            Click to expand Knowledge Assistant
          </div>
        )}
      </div>
    </div>
  );
};

export default RAGIntegration;
