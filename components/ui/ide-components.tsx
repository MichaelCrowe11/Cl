import React from 'react'
import { cn } from '@/lib/utils'

interface IDEPanelProps {
  children: React.ReactNode
  className?: string
  position: 'left' | 'right' | 'center'
  width?: string
  collapsible?: boolean
}

export function IDEPanel({ 
  children, 
  className, 
  position, 
  width = 'w-80',
  collapsible = false 
}: IDEPanelProps) {
  const baseClasses = "flex flex-col bg-muted/20 border-border"
  const positionClasses = {
    left: "border-r",
    right: "border-l", 
    center: ""
  }

  return (
    <div className={cn(
      baseClasses,
      positionClasses[position],
      width,
      className
    )}>
      {children}
    </div>
  )
}

interface IDEHeaderProps {
  title: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function IDEHeader({ title, children, actions }: IDEHeaderProps) {
  return (
    <div className="ide-header flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-sm">{title}</h2>
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-1">
          {actions}
        </div>
      )}
    </div>
  )
}

interface IDETabsProps {
  tabs: Array<{
    id: string
    label: string
    isDirty?: boolean
    isActive?: boolean
  }>
  onTabClick: (id: string) => void
  onTabClose?: (id: string) => void
}

export function IDETabs({ tabs, onTabClick, onTabClose }: IDETabsProps) {
  return (
    <div className="flex bg-muted/20 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "ide-tab flex items-center min-w-0 max-w-48",
            tab.isActive && "active",
            tab.isDirty && "dirty"
          )}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="truncate flex-1">{tab.label}</span>
          {onTabClose && (
            <button
              className="ml-2 h-4 w-4 rounded hover:bg-destructive/20 flex items-center justify-center text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onTabClose(tab.id)
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

interface StatusIndicatorProps {
  type: 'success' | 'warning' | 'error' | 'info' | 'active' | 'inactive'
  children: React.ReactNode
  className?: string
}

export function StatusIndicator({ type, children, className }: StatusIndicatorProps) {
  return (
    <span className={cn("status-indicator", type, className)}>
      {children}
    </span>
  )
}

interface FileTreeItemProps {
  name: string
  type: 'file' | 'folder'
  isExpanded?: boolean
  isActive?: boolean
  level?: number
  icon?: React.ReactNode
  onClick?: () => void
  onToggle?: () => void
}

export function FileTreeItem({ 
  name, 
  type, 
  isExpanded, 
  isActive, 
  level = 0, 
  icon,
  onClick,
  onToggle 
}: FileTreeItemProps) {
  return (
    <div 
      className={cn(
        "file-tree-item",
        isActive && "active"
      )}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={type === 'folder' ? onToggle : onClick}
    >
      {type === 'folder' && (
        <span className="w-3 h-3 flex items-center justify-center">
          {isExpanded ? '▼' : '▶'}
        </span>
      )}
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span className="truncate">{name}</span>
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("loading-dots", className)}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

interface IDETerminalProps {
  output: string[]
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  placeholder?: string
}

export function IDETerminal({ 
  output, 
  input, 
  onInputChange, 
  onSubmit,
  placeholder = "Enter command..." 
}: IDETerminalProps) {
  return (
    <div className="terminal-container">
      <div className="terminal-header h-8 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span>Terminal</span>
        </div>
      </div>
      
      <div className="h-32 p-3 overflow-y-auto">
        <div className="space-y-1 text-xs font-mono">
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-700 p-2">
        <form 
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          <span className="text-green-400 text-xs">$</span>
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none text-green-400 text-xs outline-none"
          />
        </form>
      </div>
    </div>
  )
}
