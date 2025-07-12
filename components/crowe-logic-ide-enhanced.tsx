import { 
  Settings2, 
  Monitor, 
  MessageSquare, 
  Brain, 
  Folder, 
  TerminalSquare, 
  X,
  File,
  Send,
  Loader2,
  Play,
  Plus,
  Save
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types
interface Tab {
  id: string;
  title: string;
  content?: string;
  modified?: boolean;
}

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
}

// ── Enhanced Production-Ready Crowe Logic™ IDE ─────────────────────────────
// Now with file system and terminal integration
// ----------------------------------------------------------------------------

const ACTIVITY_BAR_TOOLS = [
  { id: "explorer", icon: Folder, label: "Files" },
  { id: "chat", icon: MessageSquare, label: "CroweGPT" },
  { id: "vision", icon: Monitor, label: "Vision" },
  { id: "models", icon: Brain, label: "Models" },
  { id: "settings", icon: Settings2, label: "Settings" }
];

// Enhanced Tab Bar Component --------------------------------------------------
function EnhancedTabBar({ tabs, activeId, onSelect, onClose, onSave }: {
  tabs: Tab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onSave: (id: string) => void;
}) {
  return (
    <div className="flex text-xs bg-[#2d2d30] border-b border-[#3e3e42] overflow-x-auto">
      {tabs.map((tab: Tab) => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-2 cursor-pointer select-none gap-2 border-r border-[#3e3e42] min-w-0 whitespace-nowrap group ${
            activeId === tab.id 
              ? "bg-[#1e1e1e] text-white" 
              : "hover:bg-[#37373d] text-[#cccccc]"
          }`}
          onClick={() => onSelect(tab.id)}
        >
          <File size={14} className="flex-shrink-0 text-[#519aba]" />
          <span className="flex-1">
            {tab.title}
            {tab.modified && <span className="text-[#ff6b6b] ml-1">●</span>}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            {tab.modified && (
              <button
                className="hover:text-white hover:bg-[#5a5a5a] rounded p-0.5"
                onClick={e => {
                  e.stopPropagation();
                  onSave(tab.id);
                }}
                title="Save"
              >
                <Save size={12} strokeWidth={2} />
              </button>
            )}
            {tabs.length > 1 && (
              <button
                className="hover:text-white hover:bg-[#5a5a5a] rounded p-0.5"
                onClick={e => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                title="Close"
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        className="flex items-center px-2 py-2 text-[#858585] hover:text-white hover:bg-[#37373d]"
        title="New File"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// File Explorer Component -----------------------------------------------------
function FileExplorer({ onFileSelect }: { onFileSelect: (file: FileItem) => void }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files?action=list');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const createNewFile = async () => {
    const name = prompt('Enter file name:');
    if (!name) return;

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name,
          content: '# New file\n'
        })
      });

      if (response.ok) {
        await loadFiles();
      }
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  return (
    <div className="text-xs">
      <div className="flex items-center justify-between px-3 py-2 text-[#cccccc] font-medium uppercase tracking-wide text-[10px]">
        WORKSPACE
        <button
          onClick={createNewFile}
          className="text-[#858585] hover:text-white"
          title="New File"
        >
          <Plus size={12} />
        </button>
      </div>
      
      {loading ? (
        <div className="px-3 py-2 text-[#8c8c8c]">Loading...</div>
      ) : (
        <ul className="space-y-0.5">
          {files.map(file => (
            <li 
              key={file.name}
              className="flex items-center gap-2 px-3 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc]"
              onClick={() => onFileSelect(file)}
            >
              <File size={14} className="text-[#519aba]" />
              <span className="select-none">{file.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Terminal Component ----------------------------------------------------------
function TerminalInterface({ title, tabId }: { title: string; tabId: string }) {
  const [output, setOutput] = useState<string[]>([`# ${title} Terminal - Ready`]);
  const [command, setCommand] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const executeCommand = async () => {
    if (!command.trim() || isRunning) return;

    setIsRunning(true);
    setOutput(prev => [...prev, `$ ${command}`]);
    
    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });

      const data = await response.json();
      
      if (data.output) {
        setOutput(prev => [...prev, data.output]);
      }
      
      if (data.error) {
        setOutput(prev => [...prev, `Error: ${data.error}`]);
      }
    } catch (error) {
      setOutput(prev => [...prev, `Error: Failed to execute command`]);
    } finally {
      setIsRunning(false);
      setCommand('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-[#0c0c0c] text-[#d4d4d4] p-3 font-mono text-xs overflow-y-auto">
        {output.map((line, index) => (
          <div key={index} className={line.startsWith('$') ? 'text-[#569cd6]' : line.startsWith('Error:') ? 'text-[#f48771]' : 'text-[#d4d4d4]'}>
            {line}
          </div>
        ))}
      </div>
      
      <div className="bg-[#2d2d30] border-t border-[#3e3e42] p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
            placeholder="Enter command..."
            className="flex-1 bg-[#3c3c3c] border border-[#3e3e42] rounded px-2 py-1 text-xs text-white"
            disabled={isRunning}
          />
          <button
            onClick={executeCommand}
            disabled={!command.trim() || isRunning}
            className="bg-[#007acc] hover:bg-[#106ebe] disabled:bg-[#3e3e42] text-white rounded px-3 py-1 text-xs flex items-center gap-1"
          >
            {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Chat Component (same as before) ---------------------------------------------
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'assistant',
      content: 'Welcome to Crowe Logic Mycology Research Platform. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 text-sm font-medium text-[#cccccc]">
        CroweGPT Mycology Assistant
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
              message.type === 'assistant' ? 'bg-[#007acc]' : 'bg-[#0e639c]'
            }`}>
              {message.type === 'assistant' ? 'CG' : 'You'}
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#cccccc] mb-1">
                {message.type === 'assistant' ? 'CroweGPT' : 'You'}
              </div>
              <div className="text-sm text-[#d4d4d4] bg-[#2d2d30] rounded p-3">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded bg-[#007acc] flex items-center justify-center text-xs font-bold">
              CG
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#cccccc] mb-1">CroweGPT</div>
              <div className="text-sm text-[#d4d4d4] bg-[#2d2d30] rounded p-3 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bg-[#2d2d30] border-t border-[#3e3e42] p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about mycology research, analysis, or any questions..."
            className="flex-1 bg-[#3c3c3c] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-[#8c8c8c] focus:outline-none focus:border-[#007acc]"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#007acc] hover:bg-[#106ebe] disabled:bg-[#3e3e42] disabled:text-[#8c8c8c] text-white rounded px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CroweLogicIDEEnhanced() {
  const [activeTool, setActiveTool] = useState("chat");

  // ── Terminal tab state -------------------------------------------------------
  const [researchTabs, setResearchTabs] = useState<Tab[]>([
    { id: "analysis.py", title: "analysis.py", content: "# Analysis script\n" }
  ]);
  const [activeResearch, setActiveResearch] = useState("analysis.py");

  const [sopTabs, setSopTabs] = useState<Tab[]>([
    { id: "batch1.sop", title: "batch1.sop", content: "# SOP Protocol\n" }
  ]);
  const [activeSop, setActiveSop] = useState("batch1.sop");

  const openFile = async (file: FileItem) => {
    try {
      const response = await fetch(`/api/files?action=read&path=${file.path}`);
      const data = await response.json();
      
      const newTab: Tab = {
        id: file.name,
        title: file.name,
        content: data.content || ''
      };

      // Add to research tabs for now
      setResearchTabs(prev => {
        const exists = prev.find(tab => tab.id === file.name);
        if (exists) return prev;
        return [...prev, newTab];
      });
      
      setActiveResearch(file.name);
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  };

  const saveFile = async (tabId: string) => {
    const tab = [...researchTabs, ...sopTabs].find(t => t.id === tabId);
    if (!tab || !tab.content) return;

    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          path: `workspace/${tab.title}`,
          content: tab.content
        })
      });

      // Mark as saved
      setResearchTabs(prev => prev.map(t => 
        t.id === tabId ? { ...t, modified: false } : t
      ));
      setSopTabs(prev => prev.map(t => 
        t.id === tabId ? { ...t, modified: false } : t
      ));
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  const closeTab = (
    tabs: Tab[], 
    setTabs: React.Dispatch<React.SetStateAction<Tab[]>>, 
    setActive: React.Dispatch<React.SetStateAction<string>>, 
    closedId: string
  ) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((t: Tab) => t.id !== closedId);
    setTabs(newTabs);
    if (closedId === activeResearch || closedId === activeSop) {
      setActive(newTabs[0].id);
    }
  };

  const renderSidebarContent = () => {
    switch (activeTool) {
      case "explorer":
        return <FileExplorer onFileSelect={openFile} />;
      case "chat":
        return (
          <div className="p-3 text-xs text-[#cccccc]">
            <div className="mb-2 font-medium">Active Session</div>
            <div className="text-[#8c8c8c]">Mycology Research Assistant</div>
          </div>
        );
      default:
        return (
          <div className="p-3 text-xs text-[#8c8c8c]">
            {ACTIVITY_BAR_TOOLS.find(t => t.id === activeTool)?.label}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#1e1e1e] text-white font-sans">
      <div className="flex flex-1">
        {/* ───────────────────────── ACTIVITY BAR ───────────────────────── */}
        <aside className="w-12 bg-[#2d2d30] flex flex-col items-center py-2 border-r border-[#3e3e42]">
          {ACTIVITY_BAR_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-12 h-12 flex items-center justify-center transition-colors relative ${
                activeTool === tool.id 
                  ? "text-white bg-[#37373d]" 
                  : "text-[#858585] hover:text-white"
              }`}
              title={tool.label}
            >
              <tool.icon size={18} />
              {activeTool === tool.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </aside>

        {/* ───────────────────────── SIDEBAR ──────────────────────── */}
        <aside className="w-64 bg-[#252526] border-r border-[#3e3e42] overflow-y-auto">
          <div className="sticky top-0 px-3 py-2 text-xs font-medium bg-[#252526] border-b border-[#3e3e42] text-[#cccccc]">
            {ACTIVITY_BAR_TOOLS.find(t => t.id === activeTool)?.label?.toUpperCase()}
          </div>
          {renderSidebarContent()}
        </aside>

        {/* ───────────────────────── MAIN WORK AREA ───────────────────────── */}
        <main className="flex-1 grid grid-rows-[1fr_300px] bg-[#1e1e1e]">
          {/* Chat Interface */}
          <section className="overflow-hidden bg-[#1e1e1e]">
            <ChatInterface />
          </section>

          {/* Terminal Panel */}
          <section className="bg-[#1e1e1e] border-t border-[#3e3e42] grid grid-cols-2">
            {/* Research Terminal (left) */}
            <div className="flex flex-col border-r border-[#3e3e42]">
              <EnhancedTabBar
                tabs={researchTabs}
                activeId={activeResearch}
                onSelect={setActiveResearch}
                onClose={id => closeTab(researchTabs, setResearchTabs, setActiveResearch, id)}
                onSave={saveFile}
              />
              <div className="flex items-center gap-2 text-xs px-3 py-1 bg-[#2d2d30] border-b border-[#3e3e42] text-[#cccccc]">
                <TerminalSquare size={12} />
                Research Terminal
              </div>
              <TerminalInterface title="Research" tabId={activeResearch} />
            </div>

            {/* SOP Terminal (right) */}
            <div className="flex flex-col">
              <EnhancedTabBar
                tabs={sopTabs}
                activeId={activeSop}
                onSelect={setActiveSop}
                onClose={id => closeTab(sopTabs, setSopTabs, setActiveSop, id)}
                onSave={saveFile}
              />
              <div className="flex items-center gap-2 text-xs px-3 py-1 bg-[#2d2d30] border-b border-[#3e3e42] text-[#cccccc]">
                <TerminalSquare size={12} />
                Protocol Terminal
              </div>
              <TerminalInterface title="Protocol" tabId={activeSop} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
