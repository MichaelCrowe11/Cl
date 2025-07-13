import { 
  Plus, 
  Search, 
  FileText, 
  Folder,
  FolderOpen,
  Settings,
  Terminal as TerminalIcon,
  Send,
  Loader2,
  Sun,
  Moon,
  Code,
  Braces,
  Coffee,
  Zap,
  Maximize2,
  Minimize2,
  X,
  MoreHorizontal,
  Save,
  Play,
  Square
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types
interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  isOpen?: boolean;
}

// ── Professional IDE-Style Crowe Logic AI Interface ──────────────────────
// Stunning black/white theme with terminal and chat integration
// ────────────────────────────────────────────────────────────────────────

export default function CroweLogicIDEInterface() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: "Welcome to Crowe Logic AI! I'm your advanced mycology research assistant. I can help with substrate optimization, cultivation protocols, contamination analysis, and research methodologies. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // File management
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Terminal state
  const [terminalOutput, setTerminalOutput] = useState(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                          CROWE LOGIC AI TERMINAL                             ║
║                        Advanced Mycology Research System                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ System Status: ✓ ONLINE          │ Neural Networks: ✓ ACTIVE               ║
║ AI Models: ✓ LOADED              │ Research Database: ✓ CONNECTED          ║
║ Mycology Modules: ✓ INITIALIZED  │ Lab Interface: ✓ READY                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

Crowe Logic AI v3.0.0 - Professional Mycology Research Platform
Type 'help' for available commands, or 'lab-tools' for specialized functions.
Ready for advanced mycological analysis...

$`);
  const [terminalInput, setTerminalInput] = useState('');
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  
  // Sidebar state
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(280);
  const [activeLeftTab, setActiveLeftTab] = useState('files');
  const [activeRightTab, setActiveRightTab] = useState('tools');

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files?action=list');
      const data = await response.json();
      setFiles(data.files || [
        { name: 'substrate_protocol.md', type: 'file', path: 'workspace/substrate_protocol.md' },
        { name: 'cultivation_log.csv', type: 'file', path: 'workspace/cultivation_log.csv' },
        { name: 'research_notes.md', type: 'file', path: 'workspace/research_notes.md' },
        { name: 'scripts', type: 'folder', path: 'workspace/scripts' },
        { name: 'data', type: 'folder', path: 'workspace/data' }
      ]);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, context: 'mycology_research' }),
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
    setTerminalOutput(prev => prev + `\n$ ${command}`);
    setTerminalInput('');
    
    // Special commands for enhanced terminal experience
    if (command === 'clear') {
      setTerminalOutput(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                          CROWE LOGIC AI TERMINAL                             ║
║                        Advanced Mycology Research System                     ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ System Status: ✓ ONLINE          │ Neural Networks: ✓ ACTIVE               ║
║ AI Models: ✓ LOADED              │ Research Database: ✓ CONNECTED          ║
║ Mycology Modules: ✓ INITIALIZED  │ Lab Interface: ✓ READY                  ║
╚══════════════════════════════════════════════════════════════════════════════╝

Crowe Logic AI v3.0.0 - Professional Mycology Research Platform
Ready for advanced mycological analysis...

$`);
      return;
    }
    
    if (command === 'lab-tools') {
      setTerminalOutput(prev => prev + `
\n🧪 CROWE LOGIC LAB TOOLS
├── substrate_calculator.py     - Optimize substrate compositions
├── yield_predictor.py          - Predict mushroom yields
├── contamination_analyzer.py   - Analyze contamination risks
├── environmental_monitor.py    - Monitor growth conditions
├── species_identifier.py       - Identify mushroom species
└── research_planner.py         - Plan research experiments

Type 'python <script>' to execute tools.
`);
      return;
    }
    
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      setTerminalOutput(prev => prev + '\n' + data.output);
    } catch (error) {
      setTerminalOutput(prev => prev + '\nError executing command');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    sidebar: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    terminal: isDarkMode ? 'bg-black' : 'bg-gray-900',
    terminalText: isDarkMode ? 'text-green-400' : 'text-green-300',
    header: isDarkMode ? 'bg-gray-800' : 'bg-white',
    tab: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    tabActive: isDarkMode ? 'bg-gray-600' : 'bg-white',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    button: isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
  };

  return (
    <div className={`flex h-screen w-screen ${themeClasses.bg} ${themeClasses.text} font-mono`}>
      {/* ──────────────── HEADER BAR ──────────────── */}
      <div className={`absolute top-0 left-0 right-0 h-12 ${themeClasses.header} ${themeClasses.border} border-b flex items-center justify-between px-4 z-50`}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <h1 className="text-lg font-bold">Crowe Logic AI</h1>
          <span className="text-sm opacity-70">Professional IDE</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs opacity-60">v3.0.0</span>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${themeClasses.tab} hover:${themeClasses.tabActive} transition-colors`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ──────────────── MAIN LAYOUT ──────────────── */}
      <div className="flex flex-1 pt-12">
        
        {/* ──────────────── LEFT SIDEBAR ──────────────── */}
        <div 
          className={`${themeClasses.sidebar} ${themeClasses.border} border-r flex flex-col`}
          style={{ width: leftSidebarWidth }}
        >
          {/* Sidebar Tabs */}
          <div className={`flex ${themeClasses.border} border-b`}>
            <button
              onClick={() => setActiveLeftTab('files')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeLeftTab === 'files' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <FileText className="w-4 h-4" />
              Files
            </button>
            <button
              onClick={() => setActiveLeftTab('search')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeLeftTab === 'search' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeLeftTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">WORKSPACE</h3>
                  <button className="p-1 rounded hover:bg-gray-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  {files.map(file => (
                    <div
                      key={file.path}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedFile?.path === file.path 
                          ? 'bg-purple-600 text-white' 
                          : 'hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      {file.type === 'folder' ? (
                        <Folder className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeLeftTab === 'search' && (
              <div>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-3 py-2 rounded ${themeClasses.input} text-sm`}
                />
                <div className="mt-4 text-sm opacity-60">
                  Search results will appear here...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ──────────────── CENTER CONTENT ──────────────── */}
        <div className="flex-1 flex flex-col">
          
          {/* ──────────────── CHAT INTERFACE ──────────────── */}
          <div className={`flex-1 flex flex-col ${themeClasses.border} border-b`}>
            {/* Chat Header */}
            <div className={`h-12 ${themeClasses.header} ${themeClasses.border} border-b flex items-center justify-between px-6`}>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className="font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs opacity-60">Online</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map(message => (
                  <div key={message.id} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      {message.type === 'assistant' ? (
                        <span className="text-white text-xs font-bold">C</span>
                      ) : (
                        <span className="text-white text-xs font-bold">You</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-70 mb-2">
                        {message.type === 'assistant' ? 'Crowe Logic AI' : 'You'}
                      </div>
                      <div className="leading-relaxed">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-50 mt-2">
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm opacity-70 mb-2">Crowe Logic AI</div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="opacity-70">Analyzing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className={`p-6 ${themeClasses.border} border-t`}>
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask about mycology, research protocols, or analysis..."
                    className={`flex-1 p-3 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className={`px-6 py-3 ${themeClasses.button} text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────── TERMINAL ──────────────── */}
          <div className={`${isTerminalMaximized ? 'flex-1' : 'h-64'} ${themeClasses.terminal} flex flex-col`}>
            {/* Terminal Header */}
            <div className={`h-8 bg-gray-800 flex items-center justify-between px-4 ${themeClasses.border} border-b`}>
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-bold">CROWE LOGIC TERMINAL</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTerminalMaximized(!isTerminalMaximized)}
                  className="p-1 hover:bg-gray-700 rounded text-green-400"
                >
                  {isTerminalMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              <pre className={`text-sm ${themeClasses.terminalText} font-mono whitespace-pre-wrap`}>
                {terminalOutput}
              </pre>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-green-400">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand()}
                  className="bg-transparent border-none outline-none text-green-400 flex-1 font-mono"
                  placeholder="Enter command..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────── RIGHT SIDEBAR ──────────────── */}
        <div 
          className={`${themeClasses.sidebar} ${themeClasses.border} border-l flex flex-col`}
          style={{ width: rightSidebarWidth }}
        >
          {/* Sidebar Tabs */}
          <div className={`flex ${themeClasses.border} border-b`}>
            <button
              onClick={() => setActiveRightTab('tools')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeRightTab === 'tools' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Zap className="w-4 h-4" />
              Tools
            </button>
            <button
              onClick={() => setActiveRightTab('settings')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeRightTab === 'settings' ? themeClasses.tabActive : themeClasses.tab
              } flex items-center gap-2`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeRightTab === 'tools' && (
              <div>
                <h3 className="text-sm font-semibold mb-4">LAB TOOLS</h3>
                
                <div className="space-y-2">
                  {[
                    'Substrate Calculator',
                    'Yield Predictor',
                    'Contamination Analyzer',
                    'Environmental Monitor',
                    'Species Identifier',
                    'Research Planner',
                    'Protocol Generator',
                    'Data Visualizer'
                  ].map(tool => (
                    <button
                      key={tool}
                      className={`w-full p-3 text-left ${themeClasses.tab} hover:${themeClasses.tabActive} rounded transition-colors`}
                    >
                      <div className="text-sm font-medium">{tool}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeRightTab === 'settings' && (
              <div>
                <h3 className="text-sm font-semibold mb-4">SETTINGS</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide opacity-70">Theme</label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setIsDarkMode(true)}
                        className={`px-3 py-2 rounded text-sm ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setIsDarkMode(false)}
                        className={`px-3 py-2 rounded text-sm ${!isDarkMode ? 'bg-purple-600 text-white' : 'bg-gray-600'}`}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs uppercase tracking-wide opacity-70">Terminal Font Size</label>
                    <select className={`w-full mt-2 p-2 rounded ${themeClasses.input} text-sm`}>
                      <option>12px</option>
                      <option>14px</option>
                      <option>16px</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
