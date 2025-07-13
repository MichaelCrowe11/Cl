import { 
  Plus, 
  Search, 
  FileText, 
  Beaker, 
  QrCode, 
  Download, 
  ChevronRight,
  ChevronDown,
  Send,
  Loader2,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  MoreHorizontal
} from "lucide-react";
import {     <div className="flex h-screen w-screen bg-white text-gray-900 font-sans">
      {/* New File Dialog */}
      {showNewFileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium mb-4">Create New File</h3>
            <input
              type="text"
              placeholder="Enter file name..."
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNewFile()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowNewFileDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewFile}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────── HEADER BAR ───────────────────────── */}eState, useRef, useEffect } from "react";

// Types
interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  expanded?: boolean;
  children?: string[];
}

// ── Crowe Logic AI Lab Interface ─────────────────────────────────────────
// Matching the exact design from the screenshot
// -------------------------------------------------------------------------

export default function CroweLogicLabInterface() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set(['batches', 'projects', 'sops']));
  
  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm Crowe Logic AI, your mycology lab assistant. I can help you with substrate optimization, environmental monitoring, contamination prevention, and protocol development. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // File management state
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  // Load files on component mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files?action=list');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const createNewFile = async () => {
    if (!newFileName.trim()) return;
    
    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: newFileName,
          content: '// New file created in Crowe Logic AI Lab\n'
        })
      });
      
      if (response.ok) {
        await loadFiles();
        setNewFileName('');
        setShowNewFileDialog(false);
      }
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };
  
  const sidebarItems: SidebarItem[] = [
    {
      id: 'batches',
      label: 'batches',
      icon: <ChevronRight className="w-4 h-4" />,
      expanded: true,
      children: []
    },
    {
      id: 'projects',
      label: 'projects',
      icon: <ChevronRight className="w-4 h-4" />,
      expanded: true,
      children: []
    },
    {
      id: 'sops',
      label: 'sops',
      icon: <ChevronRight className="w-4 h-4" />,
      expanded: true,
      children: []
    }
  ];

  const sopProtocols = [
    'Sterilization Protocol',
    'Inoculation Procedure',
    'Harvesting Guidelines',
    'Contamination Response'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: 'mycology_research'
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error connecting to the AI service. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 font-sans">
      {/* ───────────────────────── HEADER ───────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">C</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Crowe Logic AI</h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500">Lab Assistant v1.0.0</span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 pt-16">
        {/* ───────────────────────── LEFT SIDEBAR ───────────────────────── */}
        <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Lab Explorer</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowNewFileDialog(true)}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Create new file"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => setSearchQuery(searchQuery ? '' : 'search')}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                  title="Search files"
                >
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Search Input */}
            {searchQuery && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            )}
            
            {/* Files Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Workspace Files</h3>
              <div className="space-y-1">
                {files.map(file => (
                  <div
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedFile?.path === file.path ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  </div>
                ))}
                {files.length === 0 && (
                  <div className="text-sm text-gray-500 italic">No files found</div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {sidebarItems.map(item => {
                const isExpanded = expandedSections.has(item.id);
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleSection(item.id)}
                      className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 transition-colors text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </button>
                    {isExpanded && item.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map(child => (
                          <div key={child} className="p-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                            {child}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ───────────────────────── MAIN CONTENT AREA ───────────────────────── */}
        <main className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">C</span>
                </div>
              </div>
              <span className="ml-3 font-medium text-gray-900">Crowe Logic AI</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                <Sun className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
                  <FileText className="w-4 h-4" />
                  SOPs
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
                  <Beaker className="w-4 h-4" />
                  Batches
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
                  <QrCode className="w-4 h-4" />
                  QR Codes
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 transition-colors">
                  <Download className="w-4 h-4" />
                  Exports
                </button>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex">
            {/* Main Chat */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        {message.type === 'assistant' ? (
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xs font-bold">C</span>
                          </div>
                        ) : (
                          <span className="text-white text-sm font-medium">You</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">
                          {message.type === 'assistant' ? 'Crowe Logic AI' : 'You'}
                        </div>
                        <div className="text-gray-900 leading-relaxed">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {isMounted ? message.timestamp.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }) : '--:--'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">C</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Crowe Logic AI</div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about cultivation, contamination, protocols..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - SOP Generation */}
            <aside className="w-80 bg-gray-50 border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">SOP Generation</h3>
              </div>
              <div className="p-4 space-y-3">
                {sopProtocols.map(protocol => (
                  <button
                    key={protocol}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-white transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{protocol}</span>
                  </button>
                ))}
              </div>
            </aside>
          </div>

          {/* Terminal */}
          <div className={`bg-black text-green-400 font-mono ${isTerminalMaximized ? 'flex-1' : 'h-64'} border-t border-gray-300 flex flex-col`}>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
              <div className="flex items-center gap-2">
                <span className="text-sm">Crowe Logic Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                  className="p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  {isTerminalMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-1 text-sm">
                <div className="text-green-400">Crowe Logic AI Terminal v1.0.0</div>
                <div className="text-green-300">Type "help" for available commands</div>
                <div className="mt-4">
                  <span className="text-green-400">$ </span>
                  <span className="text-gray-400">Enter Command...</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
