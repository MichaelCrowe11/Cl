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
  MoreHorizontal,
  Terminal,
  Play,
  Save
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

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

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
}

// ── Enhanced Crowe Logic AI Lab Interface ─────────────────────────────────────────
// Professional lab interface with full AI integration and file management
// ---------------------------------------------------------------------------------

export default function CroweLogicLabInterfaceEnhanced() {
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
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState('Crowe Logic AI Terminal v1.0.0\nReady for commands...\n');
  const [terminalInput, setTerminalInput] = useState('');

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
      setFiles([
        { name: 'substrate_protocol.md', type: 'file', path: 'workspace/substrate_protocol.md' },
        { name: 'cultivation_log.txt', type: 'file', path: 'workspace/cultivation_log.txt' },
        { name: 'research_notes.md', type: 'file', path: 'workspace/research_notes.md' }
      ]);
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

  const openFile = async (file: FileItem) => {
    setSelectedFile(file);
    try {
      const response = await fetch(`/api/files?action=read&path=${encodeURIComponent(file.path)}`);
      const data = await response.json();
      setFileContent(data.content || '// File content');
    } catch (error) {
      console.error('Failed to open file:', error);
      setFileContent('// Error loading file content');
    }
  };

  const saveFile = async () => {
    if (!selectedFile) return;
    
    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          path: selectedFile.path,
          content: fileContent
        })
      });
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'batches',
      label: 'Active Batches',
      icon: <Beaker className="w-4 h-4" />,
      expanded: true,
      children: ['Oyster Mushroom Batch #001', 'Shiitake Trial #002', 'Lions Mane Optimization #003']
    },
    {
      id: 'projects',
      label: 'Research Projects',
      icon: <FileText className="w-4 h-4" />,
      expanded: true,
      children: ['Substrate Optimization Study', 'Contamination Prevention', 'Yield Enhancement']
    },
    {
      id: 'sops',
      label: 'Standard Procedures',
      icon: <QrCode className="w-4 h-4" />,
      expanded: true,
      children: ['Sterilization Protocol', 'Inoculation Procedure', 'Harvesting Guidelines']
    }
  ];

  const protocolgenerators = [
    'Substrate Preparation',
    'Sterilization Process',
    'Inoculation Protocol',
    'Environmental Control',
    'Quality Control',
    'Harvest Procedures',
    'Data Collection',
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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
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

  const executeTerminalCommand = async () => {
    if (!terminalInput.trim()) return;
    
    const command = terminalInput;
    setTerminalOutput(prev => prev + `$ ${command}\n`);
    setTerminalInput('');
    
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      setTerminalOutput(prev => prev + data.output + '\n');
    } catch (error) {
      setTerminalOutput(prev => prev + 'Error executing command\n');
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSections = new Set(prev);
      if (newSections.has(sectionId)) {
        newSections.delete(sectionId);
      } else {
        newSections.add(sectionId);
      }
      return newSections;
    });
  };

  return (
    <div className="flex h-screen w-screen bg-white text-gray-900 font-sans">
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
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────── HEADER BAR ───────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="/crowe-logo.svg" 
              alt="Crowe Logic AI" 
              className="w-full h-full object-cover"
            />
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

      {/* ───────────────────────── MAIN LAYOUT ───────────────────────── */}
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
                    onClick={() => openFile(file)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedFile?.path === file.path ? 'bg-purple-100' : 'hover:bg-gray-100'
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
          {/* Content Tabs */}
          <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <button className="text-purple-600 border-b-2 border-purple-600 pb-1 text-sm font-medium flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <img 
                    src="/crowe-logo.svg" 
                    alt="Crowe Logic AI" 
                    className="w-full h-full object-cover"
                  />
                </div>
                AI Assistant
              </button>
              {selectedFile && (
                <button className="text-gray-500 hover:text-gray-700 pb-1 text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {selectedFile.name}
                </button>
              )}
            </div>
            {selectedFile && (
              <button
                onClick={saveFile}
                className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Chat Interface */}
            <div className="flex-1 flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {message.type === 'assistant' ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src="/crowe-logo.svg" 
                              alt="Crowe Logic AI" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">You</span>
                          </div>
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
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img 
                          src="/crowe-logo.svg" 
                          alt="Crowe Logic AI" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">Crowe Logic AI</div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-gray-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Ask about mycology, protocols, or analysis..."
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* File Editor (when file is selected) */}
            {selectedFile && (
              <div className="w-96 border-l border-gray-200 flex flex-col bg-gray-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">{selectedFile.name}</h3>
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  className="flex-1 p-4 border-none resize-none focus:outline-none font-mono text-sm"
                  placeholder="File content..."
                />
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          <div className={`border-t border-gray-200 bg-black text-green-400 ${isTerminalMaximized ? 'flex-1' : 'h-48'} flex flex-col`}>
            <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="text-sm">Terminal</span>
              </div>
              <button
                onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                {isTerminalMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className="text-sm">{terminalOutput}</pre>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
                  className="bg-transparent border-none outline-none text-green-400 flex-1"
                  placeholder="Enter command..."
                />
              </div>
            </div>
          </div>
        </main>

        {/* ───────────────────────── RIGHT SIDEBAR (SOP GENERATOR) ───────────────────────── */}
        <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Protocol Generator</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {protocolgenerators.map(protocol => (
                <button
                  key={protocol}
                  className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{protocol}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
