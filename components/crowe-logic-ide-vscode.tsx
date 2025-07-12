import { 
  Settings2, 
  Monitor, 
  MessageSquare, 
  Brain, 
  Folder, 
  TerminalSquare, 
  X,
  ChevronRight,
  ChevronDown,
  File,
  FileText,
  Image,
  Code,
  Search,
  GitBranch,
  Bug,
  Extensions,
  Activity
} from "lucide-react";
import { useState } from "react";

// ── VS Code Inspired Crowe Logic™ IDE ─────────────────────────────────────
// Enhanced with VS Code aesthetics, better spacing, and improved UX
// ----------------------------------------------------------------------------

const ACTIVITY_BAR_TOOLS = [
  { id: "explorer", icon: Folder, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "git", icon: GitBranch, label: "Source Control" },
  { id: "debug", icon: Bug, label: "Run and Debug" },
  { id: "extensions", icon: Extensions, label: "Extensions" },
  { id: "chat", icon: MessageSquare, label: "CroweGPT Chat" },
  { id: "vision", icon: Monitor, label: "Computer Vision" },
  { id: "models", icon: Brain, label: "AI Models" },
  { id: "settings", icon: Settings2, label: "Settings" }
];

const FILE_ICONS = {
  py: Code,
  js: Code,
  ts: Code,
  tsx: Code,
  json: FileText,
  log: FileText,
  sop: FileText,
  png: Image,
  jpg: Image,
  default: File
};

// Enhanced TabBar component with VS Code styling -------------------------------
function VSCodeTabBar({ tabs, activeId, onSelect, onClose, className = "" }) {
  return (
    <div className={`flex text-xs bg-[#2d2d30] border-b border-[#3e3e42] ${className}`}>
      {tabs.map(tab => {
        const extension = tab.title.split('.').pop()?.toLowerCase() || 'default';
        const IconComponent = FILE_ICONS[extension] || FILE_ICONS.default;
        
        return (
          <div
            key={tab.id}
            className={`flex items-center px-3 py-2 cursor-pointer select-none gap-2 border-r border-[#3e3e42] min-w-0 max-w-40 group ${
              activeId === tab.id 
                ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]" 
                : "hover:bg-[#37373d] text-[#cccccc]"
            }`}
            onClick={() => onSelect(tab.id)}
          >
            <IconComponent size={14} className="flex-shrink-0" />
            <span className="truncate flex-1">{tab.title}</span>
            <button
              className="opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#5a5a5a] rounded p-0.5 flex-shrink-0"
              onClick={e => {
                e.stopPropagation();
                onClose(tab.id);
              }}
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// File Explorer Component -----------------------------------------------------
function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root', 'src', 'components']));
  
  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const files = [
    { id: 'app.py', name: 'app.py', type: 'file', level: 0 },
    { id: 'src', name: 'src', type: 'folder', level: 0 },
    { id: 'analysis.py', name: 'analysis.py', type: 'file', level: 1, parent: 'src' },
    { id: 'models.py', name: 'models.py', type: 'file', level: 1, parent: 'src' },
    { id: 'components', name: 'components', type: 'folder', level: 1, parent: 'src' },
    { id: 'vision.py', name: 'vision.py', type: 'file', level: 2, parent: 'components' },
    { id: 'ai_core.py', name: 'ai_core.py', type: 'file', level: 2, parent: 'components' },
    { id: 'data', name: 'data', type: 'folder', level: 0 },
    { id: 'results.log', name: 'results.log', type: 'file', level: 1, parent: 'data' },
    { id: 'batch1.sop', name: 'batch1.sop', type: 'file', level: 1, parent: 'data' }
  ];

  return (
    <div className="text-xs">
      <div className="px-3 py-2 text-[#cccccc] font-medium uppercase tracking-wide text-[10px]">
        CROWE LOGIC WORKSPACE
      </div>
      <ul className="space-y-0.5">
        {files.map(item => {
          if (item.parent && !expandedFolders.has(item.parent)) return null;
          
          const isExpanded = expandedFolders.has(item.id);
          const IconComponent = item.type === 'folder' 
            ? (isExpanded ? ChevronDown : ChevronRight)
            : (FILE_ICONS[item.name.split('.').pop()?.toLowerCase()] || FILE_ICONS.default);
          
          return (
            <li 
              key={item.id}
              className={`flex items-center gap-1 px-3 py-1 hover:bg-[#37373d] cursor-pointer text-[#cccccc]`}
              style={{ paddingLeft: `${12 + item.level * 16}px` }}
              onClick={() => item.type === 'folder' && toggleFolder(item.id)}
            >
              <IconComponent 
                size={14} 
                className={item.type === 'folder' ? 'text-[#ffcc02]' : 'text-[#519aba]'} 
              />
              <span className="select-none">{item.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Status Bar Component --------------------------------------------------------
function StatusBar() {
  return (
    <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <GitBranch size={12} />
          main
        </span>
        <span>✓ No errors</span>
        <span>Python 3.11.0</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Ln 42, Col 16</span>
        <span>UTF-8</span>
        <span>LF</span>
        <Activity size={12} />
      </div>
    </div>
  );
}

export default function CroweLogicIDEVSCode() {
  const [activeTool, setActiveTool] = useState("explorer");
  const [sidebarWidth, setSidebarWidth] = useState(280);

  // ── Terminal tab state -------------------------------------------------------
  const [researchTabs, setResearchTabs] = useState([
    { id: "analysis.py", title: "analysis.py" },
    { id: "results.log", title: "results.log" },
    { id: "vision_model.py", title: "vision_model.py" }
  ]);
  const [activeResearch, setActiveResearch] = useState("analysis.py");

  const [sopTabs, setSopTabs] = useState([
    { id: "batch1.sop", title: "batch1.sop" },
    { id: "qr_codes.png", title: "qr_codes.png" },
    { id: "protocol.json", title: "protocol.json" }
  ]);
  const [activeSop, setActiveSop] = useState("batch1.sop");

  const closeTab = (tabs, setTabs, setActive, closedId) => {
    const newTabs = tabs.filter(t => t.id !== closedId);
    setTabs(newTabs);
    if (closedId === activeResearch || closedId === activeSop) {
      setActive(newTabs.length ? newTabs[0].id : null);
    }
  };

  const renderSidebarContent = () => {
    switch (activeTool) {
      case "explorer":
        return <FileExplorer />;
      case "search":
        return (
          <div className="p-3">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-[#3c3c3c] border border-[#3e3e42] rounded px-2 py-1 text-xs text-white"
            />
          </div>
        );
      case "chat":
        return (
          <div className="p-3 text-xs text-[#cccccc]">
            <div className="mb-2 font-medium">CroweGPT Assistant</div>
            <div className="text-[#8c8c8c]">Ready to help with mycology research and analysis</div>
          </div>
        );
      default:
        return (
          <div className="p-3 text-xs text-[#8c8c8c]">
            {ACTIVITY_BAR_TOOLS.find(t => t.id === activeTool)?.label || "Content"}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-white font-mono">
      <div className="flex flex-1">
        {/* ───────────────────────── ACTIVITY BAR ───────────────────────── */}
        <aside className="w-12 bg-[#2d2d30] flex flex-col items-center py-2 border-r border-[#3e3e42]">
          {ACTIVITY_BAR_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-12 h-12 flex items-center justify-center transition-colors relative group ${
                activeTool === tool.id 
                  ? "text-white bg-[#37373d]" 
                  : "text-[#858585] hover:text-white"
              }`}
              title={tool.label}
            >
              <tool.icon size={20} />
              {activeTool === tool.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>
              )}
            </button>
          ))}
        </aside>

        {/* ───────────────────────── SIDEBAR ──────────────────────── */}
        <aside 
          className="bg-[#252526] border-r border-[#3e3e42] overflow-y-auto"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="sticky top-0 px-3 py-2 text-xs font-medium bg-[#252526] border-b border-[#3e3e42] text-[#cccccc]">
            {ACTIVITY_BAR_TOOLS.find(t => t.id === activeTool)?.label?.toUpperCase() || "EXPLORER"}
          </div>
          {renderSidebarContent()}
        </aside>

        {/* ───────────────────────── MAIN EDITOR AREA ───────────────────────── */}
        <main className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Chat Area */}
          <section className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 text-sm font-medium text-[#cccccc]">
              CroweGPT Mycology Assistant
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Sample chat messages */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-[#007acc] flex items-center justify-center text-xs font-bold">
                  CG
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#cccccc] mb-1">CroweGPT</div>
                  <div className="text-sm text-[#d4d4d4] bg-[#2d2d30] rounded p-3">
                    Welcome to the Crowe Logic Mycology Research Platform. I'm ready to assist with your fungal research and analysis.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="bg-[#2d2d30] border-t border-[#3e3e42] p-3">
              <input
                type="text"
                placeholder="Ask about mycology research, analysis, or any questions..."
                className="w-full bg-[#3c3c3c] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-[#8c8c8c] focus:outline-none focus:border-[#007acc]"
              />
            </div>
          </section>

          {/* Terminal Panel */}
          <section className="h-80 bg-[#1e1e1e] border-t border-[#3e3e42] flex">
            {/* Research Terminal (left) */}
            <div className="flex-1 flex flex-col border-r border-[#3e3e42]">
              <VSCodeTabBar
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
                <div className="text-[#569cd6]"># Research Analysis - {activeResearch || "(no file)"}</div>
                <div className="text-[#d4d4d4] mt-2">
                  $ python analysis.py --mode=deep_learning<br/>
                  Loading mycology dataset...<br/>
                  <span className="text-[#4ec9b0]">✓ Dataset loaded successfully</span><br/>
                  Initializing neural network...<br/>
                  <span className="text-[#4ec9b0]">✓ Model ready for analysis</span>
                </div>
              </div>
            </div>

            {/* SOP Terminal (right) */}
            <div className="flex-1 flex flex-col">
              <VSCodeTabBar
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
                <div className="text-[#569cd6]"># Standard Operating Procedure - {activeSop || "(no file)"}</div>
                <div className="text-[#d4d4d4] mt-2">
                  Protocol: Mushroom Cultivation Batch #001<br/>
                  Status: <span className="text-[#4ec9b0]">Active</span><br/>
                  Temperature: 22°C | Humidity: 85%<br/>
                  <span className="text-[#dcdcaa]">QR Code generated for batch tracking</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ───────────────────────── STATUS BAR ───────────────────────── */}
      <StatusBar />
    </div>
  );
}
