"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { CroweLogo } from '@/components/crowe-logo';
import { 
  Search, 
  Settings, 
  Bell, 
  User, 
  Sun, 
  Moon,
  Database,
  Activity,
  Brain,
  Save,
  Play,
  GitBranch
} from 'lucide-react';

interface IDEHeaderProps {
  ideState: any;
}

export default function IDEHeader({ ideState }: IDEHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { state } = ideState;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSave = () => {
    const activeTab = state.tabs.find((tab: any) => tab.id === state.activeTabId);
    if (activeTab && activeTab.fileId) {
      const file = state.files.find((f: any) => f.id === activeTab.fileId);
      if (file) {
        ideState.saveFile(activeTab.fileId, file.content || '');
      }
    }
  };

  return (
    <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 relative z-50">
      {/* Left Section - Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <CroweLogo 
            variant="official-circle" 
            size={28}
            systemBranding={true}
            darkTheme={theme === 'dark'}
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">CroweOS</span>
            <Badge variant="secondary" className="text-xs">
              IDE Pro
            </Badge>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="h-8 px-2"
            title="Save Current File (Ctrl+S)"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            title="Run Current File"
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            title="Git Status"
          >
            <GitBranch className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files, commands, and functions... (Ctrl+P)"
            className="pl-10 h-8 bg-background/50 border-muted"
          />
        </div>
      </div>

      {/* Right Section - Status and Controls */}
      <div className="flex items-center gap-2">
        {/* Database Status */}
        <div className="hidden lg:flex items-center gap-2 px-2 py-1 rounded bg-background/50">
          <Database className={`h-3 w-3 ${state.dbStatus.connected ? 'text-green-500' : 'text-red-500'}`} />
          <span className="text-xs text-muted-foreground">
            {state.dbStatus.connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* AI Status */}
        <div className="hidden lg:flex items-center gap-2 px-2 py-1 rounded bg-background/50">
          <Brain className="h-3 w-3 text-blue-500" />
          <span className="text-xs text-muted-foreground">AI Ready</span>
        </div>

        {/* Activity Monitor */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          title="System Activity"
        >
          <Activity className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 px-2"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Profile */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          title="User Profile"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
