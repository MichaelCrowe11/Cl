'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGitHub: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: any) => Promise<void>
  error: AuthError | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Handle OAuth callback
      if (event === 'SIGNED_IN' && session) {
        // Check if this is a new user
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        // Create profile if it doesn't exist
        if (!profile) {
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              username: session.user.email?.split('@')[0],
              full_name: session.user.user_metadata.full_name || null,
              avatar_url: session.user.user_metadata.avatar_url || null,
            })
          
          if (error) console.error('Error creating profile:', error)
        }
        
        router.push('/dashboard')
      }
      
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      setError(error)
      throw error
    }
    
    // Create profile immediately for new signups
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: email.split('@')[0],
          full_name: metadata?.full_name || null,
        })
      
      if (profileError) console.error('Error creating profile:', profileError)
    }
  }

  const signOut = async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    if (error) {
      setError(error)
      throw error
    }
  }

  const signInWithGitHub = async () => {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user user:email'
      }
    })
    if (error) {
      setError(error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setError(error)
      throw error
    }
  }

  const updateProfile = async (updates: any) => {
    setError(null)
    if (!user) throw new Error('No user logged in')
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
    
    if (error) {
      setError(error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle, 
      signInWithGitHub, 
      resetPassword,
      updateProfile,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
} 