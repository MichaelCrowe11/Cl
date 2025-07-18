"use client";

import React, { useState } from 'react';
import { 
  Brain,
  Activity,
  Database,
  Bug,
  Settings,
  ChevronLeft,
  MessageSquare,
  Zap,
  Target,
  TestTube,
  TrendingUp,
  BarChart3,
  Monitor,
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import IDEChatInterface from '@/components/ide-chat-interface';
import CroweLogicCodeCompletion from './crowe-logic-code-completion';

interface FileTab {
  id: string;
  name: string;
  type: string;
  content: string;
}

interface EnhancedRightSidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  activeFile?: FileTab;
  selectedCode?: string;
  onCodeGenerated?: (code: string) => void;
}

const rightPanels = [
  { id: 'ai-assistant', name: 'AI Assistant', icon: <Brain className="w-4 h-4" /> },
  { id: 'code-completion', name: 'Code Completion', icon: <Code className="w-4 h-4" /> },
  { id: 'tools', name: 'Lab Tools', icon: <Activity className="w-4 h-4" /> },
  { id: 'database', name: 'Database', icon: <Database className="w-4 h-4" /> },
  { id: 'debug', name: 'Debug Console', icon: <Bug className="w-4 h-4" /> },
];

export default function EnhancedRightSidebar({
  activePanel,
  setActivePanel,
  isExpanded,
  setIsExpanded,
  activeFile,
  selectedCode,
  onCodeGenerated
}: EnhancedRightSidebarProps) {
  const [environmentData] = useState({
    temperature: 22.3,
    humidity: 85,
    co2Level: 'Normal',
    airFlow: 'Optimal'
  });

  const [activeBatches] = useState([
    { id: 'LM-001', species: 'Lions Mane', day: 12, totalDays: 16, progress: 75 },
    { id: 'OY-012', species: 'Oyster', day: 8, totalDays: 14, progress: 57 },
    { id: 'SH-003', species: 'Shiitake', day: 21, totalDays: 28, progress: 75 }
  ]);

  const [systemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    networkLatency: 12
  });

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'ai-assistant':
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/crowe-avatar.png" 
                alt="Crowe Logic AI" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="font-medium text-sm">Crowe Logic AI</div>
                <div className="text-xs text-muted-foreground">Mycology Assistant</div>
              </div>
              <Badge variant="secondary" className="text-xs ml-auto">
                Ready
              </Badge>
            </div>
            
            <div className="flex-1 min-h-0">
              <IDEChatInterface 
                currentFile={
                  activeFile 
                    ? {
                        name: activeFile.name,
                        content: activeFile.content,
                        language: activeFile.type
                      }
                    : undefined
                }
                selectedCode={selectedCode}
                onCodeGenerated={onCodeGenerated}
              />
            </div>
          </div>
        );

      case 'code-completion':
        return (
          <CroweLogicCodeCompletion
            activeFile={
              activeFile 
                ? {
                    name: activeFile.name,
                    content: activeFile.content,
                    language: activeFile.type
                  }
                : undefined
            }
            selectedCode={selectedCode}
            onCodeInsert={onCodeGenerated}
          />
        );

      case 'tools':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="w-4 h-4" />
              Lab Environment
            </div>
            
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Environment Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Temperature:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{environmentData.temperature}°C</span>
                    <Badge variant="secondary" className="text-xs">Optimal</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Humidity:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{environmentData.humidity}%</span>
                    <Badge variant="secondary" className="text-xs">Good</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-green-500" />
                    <span className="text-sm">CO₂ Level:</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{environmentData.co2Level}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Air Flow:</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{environmentData.airFlow}</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Active Cultivation Batches</h4>
              <div className="space-y-3">
                {activeBatches.map(batch => (
                  <div key={batch.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{batch.species}</div>
                        <div className="text-xs text-muted-foreground">
                          {batch.id} • Day {batch.day}/{batch.totalDays}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {batch.progress}%
                      </Badge>
                    </div>
                    <Progress value={batch.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <TestTube className="w-3 h-3 mr-1" />
                  New Batch
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Zap className="w-3 h-3 mr-1" />
                  Optimize
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Reports
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="w-4 h-4" />
              Database Explorer
            </div>
            
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-2">Connection Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Connected to CroweDB</span>
              </div>
            </Card>

            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">Tables</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                  <Database className="w-3 h-3" />
                  <span>cultivation_batches</span>
                  <Badge variant="outline" className="text-xs ml-auto">143</Badge>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                  <Database className="w-3 h-3" />
                  <span>environment_logs</span>
                  <Badge variant="outline" className="text-xs ml-auto">2.1k</Badge>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                  <Database className="w-3 h-3" />
                  <span>species_data</span>
                  <Badge variant="outline" className="text-xs ml-auto">45</Badge>
                </div>
                <div className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                  <Database className="w-3 h-3" />
                  <span>harvest_records</span>
                  <Badge variant="outline" className="text-xs ml-auto">89</Badge>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'debug':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bug className="w-4 h-4" />
              Debug Console
            </div>
            
            <Card className="p-3">
              <h4 className="font-medium text-sm mb-3">System Performance</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>{systemMetrics.cpuUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>{systemMetrics.memoryUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Disk Usage</span>
                    <span>{systemMetrics.diskUsage}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Network Latency</span>
                  <Badge variant="secondary" className="text-xs">
                    {systemMetrics.networkLatency}ms
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-3">
              <h4 className="font-medium text-sm mb-2">Debug Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-sm text-muted-foreground">No active debug session</span>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const activePanelData = rightPanels.find(p => p.id === activePanel);

  return (
    <div className="flex h-full">
      {/* Activity Bar */}
      <div className="w-12 bg-muted/30 border-l flex flex-col items-center py-2 gap-1">
        {rightPanels.map((panel) => (
          <Button
            key={panel.id}
            variant={activePanel === panel.id ? "default" : "ghost"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => {
              if (activePanel === panel.id) {
                setIsExpanded(!isExpanded);
              } else {
                setActivePanel(panel.id);
                setIsExpanded(true);
              }
            }}
            title={panel.name}
          >
            {panel.icon}
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Sidebar Content Panel */}
      {isExpanded && (
        <div className="w-80 bg-muted/30 border-l flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-medium text-sm">{activePanelData?.name}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3 sidebar-scrollbar custom-scrollbar">
            {renderPanelContent()}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
