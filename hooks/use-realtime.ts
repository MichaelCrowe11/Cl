'use client'

import { useEffect, useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'
import { useAuth } from '@/contexts/auth-context'

// Types
interface PresenceState {
  user_id: string
  username: string
  avatar_url?: string
  online_at: string
  cursor?: { x: number; y: number }
  typing?: boolean
  current_file?: string
}

interface RealtimeMessage {
  id: string
  type: 'cursor' | 'selection' | 'edit' | 'chat'
  user_id: string
  data: any
  timestamp: string
}

// Hook for presence tracking
export function usePresence(channelName: string) {
  const { user } = useAuth()
  const [presenceState, setPresenceState] = useState<Record<string, PresenceState>>({})
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) return

    // Create channel
    const presenceChannel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user.id,
        },
      },
    })

    // Track presence
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as unknown as Record<string, PresenceState[]>
        const formattedState: Record<string, PresenceState> = {}
        
        Object.entries(state).forEach(([key, presences]) => {
          if (presences && presences[0]) {
            formattedState[key] = presences[0]
          }
        })
        
        setPresenceState(formattedState)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            username: user.email?.split('@')[0] || 'Anonymous',
            avatar_url: user.user_metadata?.avatar_url,
            online_at: new Date().toISOString(),
          })
        }
      })

    setChannel(presenceChannel)

    return () => {
      presenceChannel.unsubscribe()
    }
  }, [channelName, user])

  const updatePresence = useCallback(async (data: Partial<PresenceState>) => {
    if (!channel || !user) return

    await channel.track({
      user_id: user.id,
      username: user.email?.split('@')[0] || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url,
      online_at: new Date().toISOString(),
      ...data,
    })
  }, [channel, user])

  return {
    presences: Object.values(presenceState).filter(p => p.user_id !== user?.id),
    updatePresence,
    myPresence: user ? presenceState[user.id] : null,
  }
}

// Hook for real-time collaboration in code editor
export function useCollaborativeEditing(fileId: string) {
  const { user } = useAuth()
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [collaborators, setCollaborators] = useState<PresenceState[]>([])
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number; color: string }>>({})

  useEffect(() => {
    if (!user || !fileId) return

    const editChannel = supabase.channel(`file:${fileId}`)

    editChannel
      .on('presence', { event: 'sync' }, () => {
        const state = editChannel.presenceState() as unknown as Record<string, PresenceState[]>
        const users: PresenceState[] = []
        
        Object.entries(state).forEach(([key, presences]) => {
          if (presences && presences[0] && key !== user.id) {
            users.push(presences[0])
          }
        })
        
        setCollaborators(users)
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setCursors(prev => ({
            ...prev,
            [payload.user_id]: {
              x: payload.x,
              y: payload.y,
              color: payload.color || generateUserColor(payload.user_id),
            },
          }))
        }
      })
      .on('broadcast', { event: 'selection' }, ({ payload }) => {
        // Handle text selection events
        console.log('Selection event:', payload)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await editChannel.track({
            user_id: user.id,
            username: user.email?.split('@')[0] || 'Anonymous',
            current_file: fileId,
            online_at: new Date().toISOString(),
          })
        }
      })

    setChannel(editChannel)

    return () => {
      editChannel.unsubscribe()
    }
  }, [fileId, user])

  const broadcastCursor = useCallback((x: number, y: number) => {
    if (!channel || !user) return

    channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        user_id: user.id,
        x,
        y,
        color: generateUserColor(user.id),
      },
    })
  }, [channel, user])

  const broadcastSelection = useCallback((start: number, end: number) => {
    if (!channel || !user) return

    channel.send({
      type: 'broadcast',
      event: 'selection',
      payload: {
        user_id: user.id,
        start,
        end,
      },
    })
  }, [channel, user])

  return {
    collaborators,
    cursors,
    broadcastCursor,
    broadcastSelection,
  }
}

// Hook for real-time chat messages
export function useRealtimeChat(sessionId: string) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<RealtimeMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user || !sessionId) return

    const chatChannel = supabase.channel(`chat:${sessionId}`)

    chatChannel
      .on('broadcast', { event: 'message' }, ({ payload }) => {
        setMessages(prev => [...prev, payload])
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          if (payload.typing) {
            setTypingUsers(prev => new Set(prev).add(payload.user_id))
          } else {
            setTypingUsers(prev => {
              const next = new Set(prev)
              next.delete(payload.user_id)
              return next
            })
          }
        }
      })
      .subscribe()

    return () => {
      chatChannel.unsubscribe()
    }
  }, [sessionId, user])

  const sendMessage = useCallback((content: string) => {
    if (!user) return

    const message: RealtimeMessage = {
      id: `msg-${Date.now()}`,
      type: 'chat',
      user_id: user.id,
      data: { content },
      timestamp: new Date().toISOString(),
    }

    supabase.channel(`chat:${sessionId}`).send({
      type: 'broadcast',
      event: 'message',
      payload: message,
    })
  }, [sessionId, user])

  const setTyping = useCallback((typing: boolean) => {
    if (!user) return

    supabase.channel(`chat:${sessionId}`).send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        typing,
      },
    })
  }, [sessionId, user])

  return {
    messages,
    typingUsers: Array.from(typingUsers),
    sendMessage,
    setTyping,
  }
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
          
          // Show browser notification if permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Crowe Logic AI', {
              body: payload.new.message,
              icon: '/icon-192x192.png',
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  return {
    notifications,
    requestNotificationPermission,
  }
}

// Utility function to generate consistent colors for users
function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE',
    '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85929E'
  ]
  
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash = hash & hash
  }
  
  return colors[Math.abs(hash) % colors.length]
} 