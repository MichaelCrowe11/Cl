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
  Loader2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Types
interface Tab {
  id: string;
  title: string;
}

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ── Production-Ready Crowe Logic™ IDE ─────────────────────────────────────
// Focused on core functionality with real API integration
// ----------------------------------------------------------------------------

const ACTIVITY_BAR_TOOLS = [
  { id: "explorer", icon: Folder, label: "Files" },
  { id: "chat", icon: MessageSquare, label: "CroweGPT" },
  { id: "vision", icon: Monitor, label: "Vision" },
  { id: "models", icon: Brain, label: "Models" },
  { id: "settings", icon: Settings2, label: "Settings" }
];

// Production Tab Bar Component ------------------------------------------------
function ProductionTabBar({ tabs, activeId, onSelect, onClose }: {
  tabs: Tab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
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
          <span className="flex-1">{tab.title}</span>
          {tabs.length > 1 && (
            <button
              className="opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#5a5a5a] rounded p-0.5 flex-shrink-0"
              onClick={e => {
                e.stopPropagation();
                onClose(tab.id);
              }}
            >
              <X size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// Chat Component with API Integration -----------------------------------------
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
      // Use your existing API route
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

export default function CroweLogicIDEProduction() {
  const [activeTool, setActiveTool] = useState("chat");

  // ── Terminal tab state -------------------------------------------------------
  const [researchTabs, setResearchTabs] = useState([
    { id: "analysis.py", title: "analysis.py" }
  ]);
  const [activeResearch, setActiveResearch] = useState("analysis.py");

  const [sopTabs, setSopTabs] = useState([
    { id: "batch1.sop", title: "batch1.sop" }
  ]);
  const [activeSop, setActiveSop] = useState("batch1.sop");

  const closeTab = (
    tabs: Tab[], 
    setTabs: React.Dispatch<React.SetStateAction<Tab[]>>, 
    setActive: React.Dispatch<React.SetStateAction<string>>, 
    closedId: string
  ) => {
    if (tabs.length <= 1) return; // Don't close the last tab
    const newTabs = tabs.filter((t: Tab) => t.id !== closedId);
    setTabs(newTabs);
    if (closedId === activeResearch || closedId === activeSop) {
      setActive(newTabs[0].id);
    }
  };

  const renderSidebarContent = () => {
    switch (activeTool) {
      case "explorer":
        return (
          <div className="text-xs">
            <div className="px-3 py-2 text-[#cccccc] font-medium uppercase tracking-wide text-[10px]">
              WORKSPACE
            </div>
            <ul className="space-y-0.5">
              {['analysis.py', 'models.py', 'vision.py', 'results.log', 'batch1.sop'].map(file => (
                <li 
                  key={file}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc]"
                >
                  <File size={14} className="text-[#519aba]" />
                  <span className="select-none">{file}</span>
                </li>
              ))}
            </ul>
          </div>
        );
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
              <ProductionTabBar
                tabs={researchTabs}
                activeId={activeResearch}
                onSelect={setActiveResearch}
                onClose={id => closeTab(researchTabs, setResearchTabs, setActiveResearch, id)}
              />
              <div className="flex items-center gap-2 text-xs px-3 py-1 bg-[#2d2d30] border-b border-[#3e3e42] text-[#cccccc]">
                <TerminalSquare size={12} />
                Research Terminal
              </div>
              <div className="flex-1 bg-[#0c0c0c] text-[#d4d4d4] p-3 font-mono text-xs overflow-y-auto">
                <div className="text-[#569cd6]"># {activeResearch}</div>
                <div className="text-[#d4d4d4] mt-2">
                  $ python analysis.py<br/>
                  <span className="text-[#4ec9b0]">✓ Ready for analysis</span>
                </div>
              </div>
            </div>

            {/* SOP Terminal (right) */}
            <div className="flex flex-col">
              <ProductionTabBar
                tabs={sopTabs}
                activeId={activeSop}
                onSelect={setActiveSop}
                onClose={id => closeTab(sopTabs, setSopTabs, setActiveSop, id)}
              />
              <div className="flex items-center gap-2 text-xs px-3 py-1 bg-[#2d2d30] border-b border-[#3e3e42] text-[#cccccc]">
                <TerminalSquare size={12} />
                Protocol Terminal
              </div>
              <div className="flex-1 bg-[#0c0c0c] text-[#d4d4d4] p-3 font-mono text-xs overflow-y-auto">
                <div className="text-[#569cd6]"># {activeSop}</div>
                <div className="text-[#d4d4d4] mt-2">
                  Protocol: Batch #001<br/>
                  <span className="text-[#4ec9b0]">Status: Ready</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
