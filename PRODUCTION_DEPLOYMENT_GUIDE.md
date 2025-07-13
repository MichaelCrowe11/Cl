# 🚀 Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Vercel account (recommended) or other hosting provider
- Supabase project created
- AI API keys (OpenAI, Anthropic, or Google)
- Domain name (optional)

## 📋 Step-by-Step Deployment

### 1. **Environment Variables Setup**

Create a complete `.env.production` file:

```env
# ===================================
# Core Configuration
# ===================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# ===================================
# Supabase Configuration
# ===================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ===================================
# AI Model API Keys (Choose one or more)
# ===================================
# OpenAI
OPENAI_API_KEY=sk-proj-your-openai-key
OPENAI_ORG_ID=org-your-org-id # Optional

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-api03-your-key

# Google AI (Gemini)
GOOGLE_API_KEY=your-google-ai-key

# ===================================
# OAuth Configuration (via Supabase)
# ===================================
# These are configured in Supabase Dashboard
# No need to add here unless using NextAuth directly

# ===================================
# Storage Configuration
# ===================================
# File upload limits (in bytes)
MAX_FILE_SIZE=20971520 # 20MB
ALLOWED_FILE_TYPES=image/png,image/jpeg,image/webp,application/pdf

# ===================================
# Security & Analytics
# ===================================
# Content Security Policy
CSP_REPORT_URI=https://your-domain.com/api/csp-report

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ===================================
# Python ML Services (if using)
# ===================================
PYTHON_EXECUTABLE=python3
ML_SERVICE_TIMEOUT=30000 # 30 seconds

# ===================================
# Rate Limiting
# ===================================
RATE_LIMIT_WINDOW=60000 # 1 minute
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. **Deploy to Vercel (Recommended)**

#### A. Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   # Option 1: Use Vercel Dashboard
   # Go to: https://vercel.com/[your-name]/[project]/settings/environment-variables
   
   # Option 2: Use CLI
   vercel env add OPENAI_API_KEY production
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   # ... add all other variables
   ```

#### B. Using GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production deployment"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### 3. **Deploy to Alternative Platforms**

#### Netlify

1. **Build Command**
   ```
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   - Add in Netlify Dashboard → Site Settings → Environment Variables

#### Railway

1. **Create New Project**
   ```bash
   railway login
   railway init
   railway up
   ```

2. **Add Variables**
   ```bash
   railway variables set OPENAI_API_KEY=your-key
   ```

#### Self-Hosted (VPS/Docker)

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app

   COPY package.json package-lock.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   ENV NEXT_TELEMETRY_DISABLED 1
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs
   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Build & Run**
   ```bash
   docker build -t crowe-logic-ai .
   docker run -p 3000:3000 --env-file .env.production crowe-logic-ai
   ```

### 4. **Post-Deployment Configuration**

#### A. Configure Supabase

1. **Update Allowed URLs**
   - Go to Authentication → URL Configuration
   - Add your production URL to:
     - Site URL: `https://your-domain.com`
     - Redirect URLs: `https://your-domain.com/auth/callback`

2. **Update OAuth Providers**
   - Update callback URLs for Google/GitHub OAuth
   - Google: `https://your-project.supabase.co/auth/v1/callback`
   - GitHub: `https://your-project.supabase.co/auth/v1/callback`

#### B. Apply Database Migrations

1. **Run Migrations**
   - Follow the DATABASE_MIGRATION_GUIDE.md
   - Apply both migration files in order

#### C. Configure Domain (if using custom domain)

1. **Vercel Custom Domain**
   ```
   Settings → Domains → Add Domain
   ```

2. **Update DNS Records**
   ```
   A Record: @ → 76.76.21.21
   CNAME: www → cname.vercel-dns.com
   ```

### 5. **Security Checklist** ✅

- [ ] All environment variables set correctly
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Rate limiting configured
- [ ] CORS settings appropriate
- [ ] CSP headers configured
- [ ] Database RLS policies active
- [ ] API keys have appropriate restrictions
- [ ] Error logging configured (Sentry/LogRocket)

### 6. **Performance Optimization**

1. **Enable Caching**
   ```typescript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-supabase-url.supabase.co'],
     },
     experimental: {
       optimizeCss: true,
     },
   }
   ```

2. **Configure Edge Functions**
   - Move API routes to Edge Runtime where possible
   - Use Vercel Edge Config for feature flags

3. **Enable ISR (Incremental Static Regeneration)**
   ```typescript
   export const revalidate = 3600 // Revalidate every hour
   ```

### 7. **Monitoring & Analytics**

1. **Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Error Tracking (Sentry)**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

3. **Uptime Monitoring**
   - Use services like:
     - UptimeRobot
     - Pingdom
     - Better Uptime

### 8. **Backup & Disaster Recovery**

1. **Database Backups**
   - Supabase automatic daily backups
   - Configure point-in-time recovery

2. **Code Backups**
   - GitHub repository
   - Enable branch protection

3. **Environment Variable Backup**
   ```bash
   # Backup
   vercel env pull .env.backup
   
   # Store securely (e.g., encrypted vault)
   ```

## 🎯 Launch Checklist

### Pre-Launch
- [ ] All features tested in staging
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] OAuth providers configured
- [ ] Domain DNS configured
- [ ] SSL certificate active

### Launch Day
- [ ] Deploy to production
- [ ] Verify all features working
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test authentication flow
- [ ] Verify ML services responding

### Post-Launch
- [ ] Monitor user feedback
- [ ] Check analytics
- [ ] Review error logs
- [ ] Plan first updates

## 🚨 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   npm ci
   npm run build
   ```

2. **Environment variables not loading**
   - Verify variable names match exactly
   - Check for quotes in values
   - Restart deployment

3. **Database connection issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure migrations ran successfully

4. **OAuth redirect issues**
   - Update callback URLs in providers
   - Clear browser cookies
   - Check Supabase allowed URLs

## 📞 Support Resources

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **Community Discord**: [Your Discord Link]
- **Documentation**: https://your-domain.com/docs

## 🎉 Congratulations!

Your Crowe Logic AI platform is now live in production! Monitor the deployment for the first 24-48 hours and address any issues that arise. 