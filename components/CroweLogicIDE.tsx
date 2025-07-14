"use client";

import React from 'react';
import { useIDEState } from '@/hooks/useIDEState';
import { PageWrapper } from '@/components/page-wrapper';
import { Toaster } from '@/components/ui/toaster';

// IDE Components
import IDEHeader from '@/components/ide/IDEHeader';
import Sidebar from '@/components/ide/Sidebar';
import EditorPanel from '@/components/ide/EditorPanel';
import RightPanel from '@/components/ide/RightPanel';
import TerminalDock from '@/components/ide/TerminalDock';

export default function CroweLogicIDE() {
  const ideState = useIDEState();

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* IDE Header */}
      <IDEHeader ideState={ideState} />
      
      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar ideState={ideState} />
        
        {/* Center Editor Panel */}
        <EditorPanel ideState={ideState} />
        
        {/* Right Panel */}
        <RightPanel ideState={ideState} />
      </div>
      
      {/* Bottom Terminal Dock */}
      <TerminalDock ideState={ideState} />
    </div>
  );
}
