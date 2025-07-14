"use client";

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  ChevronUp, 
  ChevronDown,
  Activity,
  FileText,
  X,
  Play,
  Square,
  RotateCcw,
  Settings,
  Copy,
  Download
} from 'lucide-react';

interface TerminalDockProps {
  ideState: any;
}

export default function TerminalDock({ ideState }: TerminalDockProps) {
  const { state, executeCommand } = ideState;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new terminal output arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.terminalLines]);

  // Focus terminal input when panel opens
  useEffect(() => {
    if (!state.bottomPanel.isCollapsed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.bottomPanel.isCollapsed]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.terminalInput.trim()) {
      executeCommand(state.terminalInput);
    }
  };

  const clearTerminal = () => {
    ideState.setState((prev: any) => ({
      ...prev,
      terminalLines: []
    }));
  };

  const copyTerminalOutput = () => {
    const output = state.terminalLines
      .map((line: any) => line.content)
      .join('\n');
    navigator.clipboard.writeText(output);
  };

  if (state.bottomPanel.isCollapsed) {
    return (
      <div className="h-8 bg-card border-t border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => ideState.togglePanel('bottom')}
            className="h-6 px-2"
          >
            <Terminal className="h-3 w-3 mr-1" />
            <span className="text-xs">Terminal</span>
            <ChevronUp className="h-3 w-3 ml-1" />
          </Button>
          {state.terminalLines.length > 0 && (
            <Badge variant="secondary" className="text-xs h-4">
              {state.terminalLines.length}
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Ready for commands
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card border-t border-border flex flex-col transition-all duration-300"
      style={{ height: state.bottomPanel.height }}
    >
      {/* Terminal Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <Tabs 
          value={state.bottomPanel.activeTab} 
          onValueChange={(value) => ideState.setPanelTab('bottom', value)}
          className="flex-1"
        >
          <TabsList className="h-8 bg-transparent">
            <TabsTrigger value="terminal" className="text-xs h-6 px-3">
              <Terminal className="h-3 w-3 mr-1" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="output" className="text-xs h-6 px-3">
              <Activity className="h-3 w-3 mr-1" />
              Output
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs h-6 px-3">
              <FileText className="h-3 w-3 mr-1" />
              Logs
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearTerminal}
            className="h-6 px-2"
            title="Clear Terminal"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyTerminalOutput}
            className="h-6 px-2"
            title="Copy Output"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2"
            title="Settings"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => ideState.togglePanel('bottom')}
            className="h-6 px-2"
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <Tabs 
        value={state.bottomPanel.activeTab} 
        onValueChange={(value) => ideState.setPanelTab('bottom', value)}
        className="flex-1 flex flex-col"
      >
        {/* Terminal Tab */}
        <TabsContent value="terminal" className="flex-1 flex flex-col m-0 p-0">
          <div className="flex-1 flex">
            {/* Terminal Output */}
            <div className="flex-1 bg-gray-950 text-green-400 font-mono text-sm">
              <ScrollArea className="h-full">
                <div ref={scrollRef} className="p-3 space-y-1">
                  {state.terminalLines.map((line: any) => (
                    <div
                      key={line.id}
                      className={`leading-5 ${
                        line.type === 'input' ? 'text-white' :
                        line.type === 'error' ? 'text-red-400' :
                        line.type === 'system' ? 'text-cyan-400' :
                        'text-green-400'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap font-mono">
                        {line.content}
                      </pre>
                    </div>
                  ))}
                  
                  {/* Terminal Input Line */}
                  <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2">
                    <span className="text-cyan-400 flex-shrink-0">$</span>
                    <Input
                      ref={inputRef}
                      value={state.terminalInput}
                      onChange={(e) => 
                        ideState.setState((prev: any) => ({ 
                          ...prev, 
                          terminalInput: e.target.value 
                        }))
                      }
                      className="flex-1 bg-transparent border-none text-white focus:ring-0 p-0 h-auto font-mono"
                      placeholder="Type command and press Enter..."
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </form>
                </div>
              </ScrollArea>
            </div>

            {/* Terminal Sidebar */}
            <div className="w-48 bg-card/50 border-l border-border p-2">
              <h4 className="text-xs font-medium mb-2 text-muted-foreground uppercase">
                Quick Commands
              </h4>
              <div className="space-y-1">
                {[
                  { cmd: 'help', desc: 'Show available commands' },
                  { cmd: 'analyze-batch CL-001', desc: 'Analyze cultivation batch' },
                  { cmd: 'monitor-env', desc: 'Check environment status' },
                  { cmd: 'create-protocol oyster', desc: 'Generate protocol' },
                  { cmd: 'contamination-scan', desc: 'Run AI contamination check' },
                  { cmd: 'python cultivation-protocol.py', desc: 'Run Python script' },
                  { cmd: 'clear', desc: 'Clear terminal' }
                ].map((item) => (
                  <Button
                    key={item.cmd}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-auto p-2 text-left"
                    onClick={() => {
                      ideState.setState((prev: any) => ({ 
                        ...prev, 
                        terminalInput: item.cmd 
                      }));
                      executeCommand(item.cmd);
                    }}
                  >
                    <div>
                      <div className="text-xs font-mono">{item.cmd}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.desc}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Terminal Stats */}
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-xs font-medium mb-2 text-muted-foreground uppercase">
                  Session Stats
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Commands:</span>
                    <span>{state.terminalLines.filter((l: any) => l.type === 'input').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span>2h 34m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="secondary" className="h-4 text-xs">
                      Ready
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Output Tab */}
        <TabsContent value="output" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2 font-mono text-sm">
              <div className="text-green-600">
                [INFO] Cultivation analysis complete
              </div>
              <div className="text-blue-600">
                [DEBUG] Environmental sensors reading: OK
              </div>
              <div className="text-yellow-600">
                [WARN] Batch CL-002 approaching harvest window
              </div>
              <div className="text-green-600">
                [INFO] AI recommendations generated
              </div>
              <div className="text-gray-600">
                [TRACE] Database sync: 47 records updated
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="text-sm font-medium">System Initialization</div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  Crowe Logic IDE started successfully. All systems operational.
                </div>
              </div>
              
              <div className="border-l-2 border-green-500 pl-3">
                <div className="text-sm font-medium">File Operations</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(Date.now() - 5 * 60000).toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  cultivation-protocol.py saved to database
                </div>
              </div>
              
              <div className="border-l-2 border-yellow-500 pl-3">
                <div className="text-sm font-medium">AI Assistant</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(Date.now() - 10 * 60000).toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  Generated 2 code suggestions for mycology analysis
                </div>
              </div>
              
              <div className="border-l-2 border-purple-500 pl-3">
                <div className="text-sm font-medium">Database Sync</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(Date.now() - 15 * 60000).toLocaleString()}
                </div>
                <div className="text-sm mt-1">
                  Synchronized {state.dbStatus.filesSaved} files with cloud storage
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Terminal Status Bar */}
      <div className="h-6 bg-card/50 border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Terminal Ready</span>
          <span>PWD: /lab/crowe-logic/cultivation-workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Shell: bash</span>
          <span>Python: 3.11.5</span>
          {state.dbStatus.connected && (
            <span className="text-green-500">● Database Connected</span>
          )}
        </div>
      </div>
    </div>
  );
}
