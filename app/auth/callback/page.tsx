'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // The auth state change in AuthContext will handle the redirect
    // This page just shows a loading state
    const timer = setTimeout(() => {
      // Fallback redirect if auth context doesn't redirect
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Completing sign in...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-center text-muted-foreground">
            Please wait while we complete your authentication.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 