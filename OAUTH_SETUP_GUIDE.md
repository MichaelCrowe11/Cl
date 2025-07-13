# 🔐 OAuth Authentication Setup Guide

## ✅ Current Implementation Status

Your OAuth system is **fully implemented** with:
- ✅ Google OAuth integration
- ✅ GitHub OAuth integration  
- ✅ Email/Password authentication
- ✅ Password reset functionality
- ✅ User profile management
- ✅ Protected routes with middleware

## 🚀 Quick Setup Steps

### 1. **Supabase Configuration**

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Enable the following providers:

#### Google OAuth Setup:
1. Enable **Google** provider
2. Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret to Supabase

#### GitHub OAuth Setup:
1. Enable **GitHub** provider
2. Go to [GitHub Developer Settings](https://github.com/settings/developers)
3. Create a new OAuth App:
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### 2. **Environment Variables**

Ensure your `.env.local` has:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: For direct OAuth (if not using Supabase's built-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. **Database Setup**

Run this SQL in Supabase SQL editor:

```sql
-- Already in your migration file, but run if needed:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  organization TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. **Test Authentication Flow**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test each authentication method:
   - **Email/Password**: Register at `/auth/register`
   - **Google OAuth**: Click "Continue with Google"
   - **GitHub OAuth**: Click "Continue with GitHub"

3. Verify:
   - ✅ Successful redirect to `/dashboard` after login
   - ✅ User profile created in database
   - ✅ Session persists on refresh
   - ✅ Protected routes redirect to login when not authenticated

## 🎯 Current Features Working

- **AuthContext** (`/contexts/auth-context.tsx`): Manages all auth state
- **Login Page** (`/app/auth/login/page.tsx`): Beautiful login UI with OAuth
- **Register Page** (`/app/auth/register/page.tsx`): User registration with email verification
- **Callback Handler** (`/app/auth/callback/page.tsx`): Handles OAuth redirects
- **Middleware** (`/middleware.ts`): Protects routes requiring authentication
- **Dashboard** (`/app/dashboard/page.tsx`): Authenticated user area

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid redirect URL"**
   - Ensure callback URLs match exactly in OAuth provider settings
   - Check Supabase allowed redirect URLs

2. **"User not created in profiles table"**
   - Check if trigger is created and active
   - Verify RLS policies

3. **"OAuth login redirects to homepage"**
   - Check AuthContext redirect logic
   - Verify middleware configuration

## 📱 Production Deployment

Before deploying:

1. Update OAuth redirect URLs to production domain
2. Set production environment variables in Vercel/hosting platform
3. Ensure HTTPS is enabled (required for OAuth)
4. Test all auth flows in production environment

## ✨ Next Steps

Your authentication is ready! You can now:
- Customize user profiles
- Add role-based access control
- Implement team/organization features
- Add social login for more providers (Twitter, Discord, etc.) 