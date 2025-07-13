'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { usePresence } from '@/hooks/use-realtime'

interface PresenceIndicatorProps {
  channelName: string
  className?: string
  showDetails?: boolean
}

export function PresenceIndicator({ 
  channelName, 
  className,
  showDetails = false 
}: PresenceIndicatorProps) {
  const { presences, myPresence } = usePresence(channelName)

  if (!showDetails) {
    // Simple view - just avatars
    return (
      <div className={cn("flex items-center -space-x-2", className)}>
        {presences.slice(0, 3).map((presence) => (
          <Avatar 
            key={presence.user_id} 
            className="h-8 w-8 border-2 border-background"
            title={presence.username}
          >
            <AvatarImage src={presence.avatar_url} />
            <AvatarFallback className="text-xs">
              {presence.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {presences.length > 3 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background">
            <span className="text-xs font-medium">+{presences.length - 3}</span>
          </div>
        )}
      </div>
    )
  }

  // Detailed view - list with status
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Online Users</h3>
        <Badge variant="secondary" className="text-xs">
          {presences.length + 1} online
        </Badge>
      </div>
      
      <div className="space-y-1">
        {/* Current user */}
        {myPresence && (
          <div className="flex items-center gap-2 p-1.5 rounded-md bg-primary/10">
            <div className="relative">
              <Avatar className="h-6 w-6">
                <AvatarImage src={myPresence.avatar_url} />
                <AvatarFallback className="text-xs">
                  {myPresence.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <span className="text-sm font-medium">You</span>
            {myPresence.current_file && (
              <span className="text-xs text-muted-foreground ml-auto">
                {myPresence.current_file.split('/').pop()}
              </span>
            )}
          </div>
        )}
        
        {/* Other users */}
        {presences.map((presence) => (
          <div key={presence.user_id} className="flex items-center gap-2 p-1.5">
            <div className="relative">
              <Avatar className="h-6 w-6">
                <AvatarImage src={presence.avatar_url} />
                <AvatarFallback className="text-xs">
                  {presence.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
            </div>
            <span className="text-sm">{presence.username}</span>
            {presence.typing && (
              <span className="text-xs text-muted-foreground">typing...</span>
            )}
            {presence.current_file && (
              <span className="text-xs text-muted-foreground ml-auto">
                {presence.current_file.split('/').pop()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Cursor component for collaborative editing
export function CollaborativeCursor({ 
  x, 
  y, 
  color, 
  username 
}: { 
  x: number
  y: number
  color: string
  username: string 
}) {
  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-100"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <svg
        className="relative"
        width="18"
        height="24"
        viewBox="0 0 18 24"
        fill="none"
      >
        <path
          d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L16.3863 6.68641C17.2271 7.0178 17.2325 8.20739 16.3947 8.54976L9.85984 11.126L6.61167 17.8082C6.26979 18.4891 5.33574 18.4158 5.09577 17.6989L0.928548 2.18278Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <div 
        className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {username}
      </div>
    </div>
  )
}

// Typing indicator for chat
export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2">
      <div className="flex space-x-1">
        <span className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground/50" style={{ animationDelay: '0ms' }} />
        <span className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground/50" style={{ animationDelay: '150ms' }} />
        <span className="animate-bounce h-2 w-2 rounded-full bg-muted-foreground/50" style={{ animationDelay: '300ms' }} />
      </div>
      <span>
        {users.length === 1 
          ? `${users[0]} is typing...`
          : `${users.join(', ')} are typing...`
        }
      </span>
    </div>
  )
} 