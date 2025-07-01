# Next Steps Implementation Guide

## 🚀 Step 1: Get AI Working Now (5 minutes)

### 1.1 Add Your API Key

Edit `.env.local` and add ONE of these keys:

**Option A - Claude (Recommended):**
```
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```
Get your key: https://console.anthropic.com/account/keys

**Option B - OpenAI:**
```
OPENAI_API_KEY=sk-YOUR-KEY-HERE
```
Get your key: https://platform.openai.com/api-keys

### 1.2 Test Your AI

```bash
# Start the development server
pnpm dev
```

Then:
1. Open http://localhost:3000
2. Ask: "What's the optimal temperature for oyster mushroom fruiting?"
3. You should get a real AI response!

---

## 📊 Step 2: Add Database & Authentication (Day 1-2)

### 2.1 Set Up Supabase

```bash
# Install Supabase client
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
```

1. Create free account at https://supabase.com
2. Create new project
3. Get your credentials from Settings > API
4. Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-KEY
```

### 2.2 Create Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat sessions
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  model TEXT DEFAULT 'claude-3-opus',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON chat_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );
```

### 2.3 Create Supabase Client

Create `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

---

## 🔐 Step 3: Implement Authentication (Day 2-3)

### 3.1 Create Auth Context

Create `contexts/auth-context.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### 3.2 Create Login Page

Create `app/auth/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login to Crowe Logic AI</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <p className="text-center text-sm">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  )
}
```

---

## 📱 Step 4: Create Dashboard (Day 3-4)

### 4.1 Dashboard Layout

Create `app/dashboard/layout.tsx`:

```typescript
'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-secondary p-4">
        <h2 className="text-xl font-bold mb-4">Crowe Logic AI</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block p-2 hover:bg-background rounded">Dashboard</a>
          <a href="/chat" className="block p-2 hover:bg-background rounded">Chat</a>
          <a href="/experiments" className="block p-2 hover:bg-background rounded">Experiments</a>
          <a href="/reports" className="block p-2 hover:bg-background rounded">Reports</a>
        </nav>
        <Button onClick={signOut} variant="outline" className="mt-auto w-full">
          Sign Out
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
```

### 4.2 Dashboard Page

Create `app/dashboard/page.tsx`:

```typescript
'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user?.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Chats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No chats yet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No experiments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">API calls</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

---

## 💰 Step 5: Add Stripe Integration (Day 4-5)

### 5.1 Install Stripe

```bash
pnpm add @stripe/stripe-js
```

### 5.2 Create Pricing Page

Create `app/pricing/page.tsx`:

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['10 AI queries/day', 'Basic models', 'Community support'],
    priceId: null,
  },
  {
    name: 'Pro',
    price: '$49/mo',
    features: ['Unlimited queries', 'All AI models', 'Priority support', 'Export features'],
    priceId: 'price_YOUR_STRIPE_PRICE_ID',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Custom limits', 'Dedicated support', 'API access', 'Custom models'],
    priceId: null,
  },
]

export default function PricingPage() {
  const handleSubscribe = async (priceId: string) => {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url } = await response.json()
    window.location.href = url
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full" 
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                disabled={!plan.priceId}
              >
                {plan.priceId ? 'Subscribe' : 'Contact Sales'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## 🚀 Quick Implementation Timeline

### Today:
1. ✅ Add API key to `.env.local`
2. ✅ Test AI chat functionality
3. ✅ Install Supabase dependencies

### Tomorrow:
1. 🔨 Set up Supabase project
2. 🔨 Create database schema
3. 🔨 Implement authentication

### This Week:
1. 📊 Build dashboard
2. 💾 Add chat persistence
3. 💰 Set up Stripe (optional)

### Next Week:
1. 🧪 Add experiments feature
2. 📈 Create reports section
3. 🚀 Deploy to production

## Need Help?

Run into issues? Here are common problems:

1. **TypeScript errors in IDE**: These are just IDE issues, the app will still run
2. **API not working**: Make sure your API key is correctly formatted
3. **Database errors**: Check Supabase dashboard for logs

Ready to start? Let's begin with Step 1! 