"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight,
  Zap,
  Database,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Brain,
  Code,
  FileText,
  Beaker
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RightPanelProps {
  ideState: any;
}

export default function RightPanel({ ideState }: RightPanelProps) {
  const { state } = ideState;
  const { toast } = useToast();

  const insertCodeSuggestion = (suggestion: any) => {
    const activeTab = state.tabs.find((tab: any) => tab.id === state.activeTabId);
    if (activeTab && activeTab.fileId) {
      const file = state.files.find((f: any) => f.id === activeTab.fileId);
      if (file) {
        const newContent = (file.content || '') + '\n\n' + suggestion.code;
        ideState.setState((prev: any) => ({
          ...prev,
          files: prev.files.map((f: any) => 
            f.id === file.id 
              ? { ...f, content: newContent, isDirty: true }
              : f
          )
        }));
        
        toast({
          title: "Code Inserted",
          description: suggestion.description,
        });
      }
    }
  };

  if (state.rightPanel.isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-2 gap-1">
        <Button
          variant={state.rightPanel.activeTab === 'suggestions' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => ideState.togglePanel('right')}
          title="AI Suggestions"
        >
          <Zap className="h-4 w-4" />
        </Button>
        <Button
          variant={state.rightPanel.activeTab === 'database' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => {
            ideState.setPanelTab('right', 'database');
            ideState.togglePanel('right');
          }}
          title="Database"
        >
          <Database className="h-4 w-4" />
        </Button>
        <Button
          variant={state.rightPanel.activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          className="w-10 h-10 p-0"
          onClick={() => {
            ideState.setPanelTab('right', 'analytics');
            ideState.togglePanel('right');
          }}
          title="Analytics"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="bg-card border-l border-border flex flex-col transition-all duration-300"
      style={{ width: state.rightPanel.width }}
    >
      {/* Panel Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3">
        <h2 className="font-medium text-sm">Assistant</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => ideState.togglePanel('right')}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs 
        value={state.rightPanel.activeTab} 
        onValueChange={(value) => ideState.setPanelTab('right', value)}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-10">
          <TabsTrigger value="suggestions" className="flex-1 rounded-none text-xs">
            <Zap className="h-3 w-3 mr-1" />
            AI
          </TabsTrigger>
          <TabsTrigger value="database" className="flex-1 rounded-none text-xs">
            <Database className="h-3 w-3 mr-1" />
            Data
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1 rounded-none text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            Stats
          </TabsTrigger>
        </TabsList>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {/* AI Assistant Header */}
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/crowe-avatar.png" alt="Crowe Logic AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Crowe Logic AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Research & Development</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Code className="h-3 w-3 mr-1" />
                    Code Help
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Gen SOP
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Beaker className="h-3 w-3 mr-1" />
                    Protocol
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                </div>
              </div>

              {/* Code Suggestions */}
              {state.codeSuggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Code Suggestions
                  </h3>
                  <div className="space-y-2">
                    {state.codeSuggestions.map((suggestion: any) => (
                      <Card 
                        key={suggestion.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => insertCodeSuggestion(suggestion)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">{suggestion.description}</span>
                            <Badge 
                              variant={suggestion.confidence > 0.9 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs mb-2">
                            {suggestion.category}
                          </Badge>
                          <pre className="text-xs bg-muted p-2 rounded overflow-hidden font-mono">
                            {suggestion.code.substring(0, 120)}...
                          </pre>
                          <Button size="sm" className="w-full mt-2 h-6 text-xs">
                            Insert Code
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Insights */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Research Insights
                </h3>
                <div className="space-y-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Optimal Conditions Detected</p>
                          <p className="text-xs text-muted-foreground">
                            Current environmental parameters are within optimal ranges for Pleurotus cultivation.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">pH Adjustment Recommended</p>
                          <p className="text-xs text-muted-foreground">
                            Consider buffering substrate pH to 6.2-6.8 range for improved yield.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {/* Connection Status */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connection:</span>
                    <Badge variant={state.dbStatus.connected ? 'default' : 'destructive'}>
                      {state.dbStatus.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Files Saved:</span>
                    <span className="text-sm font-medium">{state.dbStatus.filesSaved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last Sync:</span>
                    <span className="text-sm font-medium">
                      {state.dbStatus.lastSync.toLocaleTimeString()}
                    </span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">Storage: 85% used</p>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>cultivation-protocol.py</span>
                      <span className="text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>sterilization-sop.md</span>
                      <span className="text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>batch-data.json</span>
                      <span className="text-muted-foreground">10 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Research Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Batches:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protocols:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Analysis Scripts:</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">94.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex-1 flex flex-col m-0 p-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {/* Performance Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Code Quality</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Test Coverage</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Documentation</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Cultivation Analytics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cultivation Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Avg. Yield:</span>
                    <span className="font-medium">16.8% BE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contamination Rate:</span>
                    <span className="font-medium text-green-600">0.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cycle Time:</span>
                    <span className="font-medium">13.2 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quality Grade A:</span>
                    <span className="font-medium">82%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-purple-500/10 rounded flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      Yield trending +12% this month
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Research Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Research Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Protocol Development</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Data Collection</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Analysis Pipeline</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
