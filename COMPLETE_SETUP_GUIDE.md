# Complete Setup Guide for Crowe Logic AI

## Prerequisites Missing! Let's fix them:

### Step 1: Install Node.js (Required)

1. **Download Node.js** from: https://nodejs.org/
   - Choose the LTS version (recommended)
   - Run the installer
   - Make sure to check "Add to PATH" during installation

2. **Restart your terminal** after installation

### Step 2: Install Dependencies

Open a new PowerShell terminal in your project folder and run:

```powershell
# Option A: Using pnpm (recommended by Vercel)
npm install -g pnpm
pnpm install

# Option B: Using npm (if pnpm fails)
npm install
```

### Step 3: Add Your AI API Key

1. Open `.env.local` in any text editor (Notepad, VS Code, etc.)
2. Add ONE of these lines:

```
# For Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE

# OR for OpenAI
OPENAI_API_KEY=sk-YOUR-KEY-HERE
```

Get your API key from:
- Claude: https://console.anthropic.com/account/keys
- OpenAI: https://platform.openai.com/api-keys

### Step 4: Start the Application

```powershell
# Using pnpm
pnpm dev

# OR using npm
npm run dev
```

### Step 5: Test Your AI

1. Open http://localhost:3000 in your browser
2. Type a question like "What's the best substrate for oyster mushrooms?"
3. You should get a real AI response!

## Troubleshooting

### If node/npm commands don't work:
- Make sure you restarted your terminal after installing Node.js
- Try opening a new PowerShell window as Administrator

### If pnpm install fails:
- Use `npm install` instead
- The project will work with either package manager

### If the AI doesn't respond:
- Check that your API key is correctly formatted in `.env.local`
- Make sure there are no spaces or quotes around the key
- Check the browser console (F12) for error messages

## What's Next?

Once you have the AI working, we can:
1. Add user authentication
2. Save chat history to a database
3. Build the dashboard
4. Add more features

Let me know when you've completed these steps! 