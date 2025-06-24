# Quick Setup Guide - Get AI Working in 5 Minutes

## Problem Summary
Your Crowe Logic AI platform is deployed but the AI chat feature shows mock responses because API keys are missing.

## Immediate Fix - Get AI Working

### Step 1: Get API Keys (Choose One or Both)

#### Option A: Anthropic Claude (Recommended)
1. Go to https://console.anthropic.com/settings/keys
2. Sign up/Login
3. Create a new API key
4. Copy the key (starts with `sk-ant-api03-`)

#### Option B: OpenAI GPT
1. Go to https://platform.openai.com/api-keys
2. Sign up/Login
3. Create a new API key
4. Copy the key (starts with `sk-proj-`)

### Step 2: Add Keys to Vercel

1. Go to your Vercel dashboard
2. Select your `Cl` project
3. Go to Settings → Environment Variables
4. Add these variables:

```
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

### Step 3: Redeploy
1. In Vercel, go to Deployments
2. Click the three dots on the latest deployment
3. Select "Redeploy"

## Testing the AI

Once deployed, test at https://v0-ai-chat-interface-git-main-michaelcrowe11s-projects.vercel.app

Try these prompts:
- "What's the optimal substrate mix for oyster mushrooms?"
- "Analyze contamination risks in my grow room"
- "Create a business plan for a mushroom farm"

## Local Development Setup

1. Create `.env.local` file in project root:
```env
ANTHROPIC_API_KEY=your-anthropic-key
OPENAI_API_KEY=your-openai-key
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run development server:
```bash
npm run dev
# or
pnpm dev
```

## Current Features Status

### ✅ Working (with API keys)
- AI Chat with Claude-3-Opus
- Multiple AI model support
- Beautiful UI/UX
- Dark/Light theme

### ⚠️ Mock Data (needs implementation)
- User authentication
- Dashboard
- Batch management
- Reports
- Database storage

### 🔧 Next Steps
1. Get API keys working first
2. Test AI functionality
3. Then implement missing features from DEPLOYMENT_ROADMAP.md

## Troubleshooting

### AI Still Shows Mock Responses?
- Check API key format (Claude: `sk-ant-api03-`, OpenAI: `sk-proj-`)
- Verify keys in Vercel environment variables
- Check browser console for errors
- Ensure redeploy completed

### Build Errors on Vercel?
- All TypeScript errors are already fixed
- If new errors appear, check build logs

## Cost Considerations
- Claude-3-Opus: ~$15/million input tokens
- GPT-4: ~$10/million input tokens
- Start with free credits from both providers
- Monitor usage in their dashboards

## Need Help?
The codebase is ready - you just need API keys to activate the AI features! 