import { 
  Settings2, 
  Monitor, 
  MessageSquare, 
  Brain, 
  Folder, 
  TerminalSquare, 
  X,
  File,
  Search,
  GitBranch,
  Extensions
} from "lucide-react";
import { useState } from "react";

// ── VS Code Inspired Crowe Logic™ IDE (Simplified) ────────────────────────
// Clean, focused design with VS Code aesthetics
// ----------------------------------------------------------------------------

const ACTIVITY_BAR_TOOLS = [
  { id: "explorer", icon: Folder, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },  
  { id: "chat", icon: MessageSquare, label: "CroweGPT" },
  { id: "vision", icon: Monitor, label: "Vision" },
  { id: "models", icon: Brain, label: "Models" },
  { id: "settings", icon: Settings2, label: "Settings" }
];

// VS Code Tab Bar Component ---------------------------------------------------
function VSCodeTabBar({ tabs, activeId, onSelect, onClose }) {
  return (
    <div className="flex text-xs bg-[#2d2d30] border-b border-[#3e3e42]">
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-2 cursor-pointer select-none gap-2 border-r border-[#3e3e42] min-w-0 max-w-40 group ${
            activeId === tab.id 
              ? "bg-[#1e1e1e] text-white" 
              : "hover:bg-[#37373d] text-[#cccccc]"
          }`}
          onClick={() => onSelect(tab.id)}
        >
          <File size={14} className="flex-shrink-0 text-[#519aba]" />
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
      ))}
    </div>
  );
}

// File Explorer Component -----------------------------------------------------
function FileExplorer() {
  const files = [
    "analysis.py", "models.py", "vision.py", "ai_core.py", 
    "results.log", "batch1.sop", "protocol.json", "qr_codes.png"
  ];

  return (
    <div className="text-xs">
      <div className="px-3 py-2 text-[#cccccc] font-medium uppercase tracking-wide text-[10px]">
        CROWE LOGIC WORKSPACE
      </div>
      <ul className="space-y-0.5">
        {files.map(file => (
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
}

export default function CroweLogicIDESimple() {
  const [activeTool, setActiveTool] = useState("explorer");

  // ── Terminal tab state -------------------------------------------------------
  const [researchTabs, setResearchTabs] = useState([
    { id: "analysis.py", title: "analysis.py" },
    { id: "results.log", title: "results.log" }
  ]);
  const [activeResearch, setActiveResearch] = useState("analysis.py");

  const [sopTabs, setSopTabs] = useState([
    { id: "batch1.sop", title: "batch1.sop" },
    { id: "qr_codes.png", title: "qr_codes.png" }
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
              placeholder="Search files..." 
              className="w-full bg-[#3c3c3c] border border-[#3e3e42] rounded px-2 py-1 text-xs text-white"
            />
          </div>
        );
      case "chat":
        return (
          <div className="p-3 text-xs text-[#cccccc]">
            <div className="mb-2 font-medium">CroweGPT</div>
            <div className="text-[#8c8c8c]">AI Assistant for Mycology</div>
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
        <main className="flex-1 grid grid-rows-[1fr_auto_auto] grid-cols-[1fr_1fr] bg-[#1e1e1e]">
          {/* Chat window spans 2 columns */}
          <section className="col-span-2 overflow-y-auto bg-[#1e1e1e] border-b border-[#3e3e42]">
            <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2 text-sm font-medium text-[#cccccc]">
              CroweGPT Mycology Assistant
            </div>
            <div className="p-4 space-y-4">
              {/* Sample chat message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-[#007acc] flex items-center justify-center text-xs font-bold">
                  CG
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#cccccc] mb-1">CroweGPT</div>
                  <div className="text-sm text-[#d4d4d4] bg-[#2d2d30] rounded p-3">
                    Ready to assist with mycology research and analysis.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Text input spans 2 columns */}
          <section className="col-span-2 bg-[#2d2d30] p-3 border-b border-[#3e3e42]">
            <input
              type="text"
              placeholder="Ask about mycology research..."
              className="w-full bg-[#3c3c3c] border border-[#3e3e42] rounded px-3 py-2 text-sm text-white placeholder-[#8c8c8c] focus:outline-none focus:border-[#007acc]"
            />
          </section>

          {/* Research terminal (left) */}
          <section className="overflow-y-auto bg-[#1e1e1e] border-r border-[#3e3e42] flex flex-col">
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
              <div className="text-[#569cd6]"># {activeResearch || "No file selected"}</div>
              <div className="text-[#d4d4d4] mt-2">
                $ python analysis.py<br/>
                <span className="text-[#4ec9b0]">✓ Analysis complete</span>
              </div>
            </div>
          </section>

          {/* SOP terminal (right) */}
          <section className="overflow-y-auto bg-[#1e1e1e] flex flex-col">
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
              <div className="text-[#569cd6]"># {activeSop || "No file selected"}</div>
              <div className="text-[#d4d4d4] mt-2">
                Protocol: Batch #001<br/>
                <span className="text-[#4ec9b0]">Status: Active</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ───────────────────────── STATUS BAR ───────────────────────── */}
      <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            main
          </span>
          <span>Python 3.11</span>
        </div>
        <div className="flex items-center gap-4">
          <span>CroweLogic AI</span>
        </div>
      </div>
    </div>
  );
}
