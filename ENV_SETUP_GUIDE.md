# Environment Variables Setup Guide

This guide will help you set up the environment variables for OpenAI and Anthropic Claude models.

## Quick Setup

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and add your API keys.

## Required Environment Variables

### OpenAI Configuration

```env
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: If you have an organization ID
OPENAI_ORG_ID=org-xxxxxxxxxxxxxxxxxxxx

# API Endpoint (usually not needed to change)
OPENAI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
```

### Anthropic Claude Configuration

```env
# Get your API key from: https://console.anthropic.com/account/keys
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# API Version (keep this as is)
ANTHROPIC_API_VERSION=2023-06-01

# API Endpoint (usually not needed to change)
ANTHROPIC_API_ENDPOINT=https://api.anthropic.com/v1/messages
```

### Default Model Settings

```env
# Choose your default model
# Options: gpt-4, gpt-4-turbo, gpt-3.5-turbo, claude-3-opus, claude-3-sonnet, claude-3-haiku
DEFAULT_AI_MODEL=gpt-4

# Model parameters
DEFAULT_TEMPERATURE=0.7  # 0.0 to 1.0 (higher = more creative)
DEFAULT_MAX_TOKENS=2048  # Maximum response length
```

### For Vercel Deployment

When deploying to Vercel, add these environment variables in your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with the same names and values

## Model Comparison

| Model | Best For | Speed | Cost | Max Tokens |
|-------|----------|-------|------|------------|
| **GPT-4** | Complex reasoning, analysis | Slower | Higher | 8,192 |
| **GPT-4 Turbo** | Balance of capability and speed | Medium | Medium | 128,000 |
| **GPT-3.5 Turbo** | Quick responses, simple tasks | Fast | Low | 4,096 |
| **Claude 3 Opus** | Complex analysis, creativity | Slower | Higher | 200,000 |
| **Claude 3 Sonnet** | Balanced performance | Medium | Medium | 200,000 |
| **Claude 3 Haiku** | Fast responses | Fast | Low | 200,000 |

## Getting API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Create a new secret key
5. Copy and save it securely

### Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API keys
4. Create a new key
5. Copy and save it securely

## Testing Your Configuration

After setting up your environment variables:

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Test with a simple query in the chat interface

3. Check the console for any API errors

## Security Best Practices

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`
2. **Use different API keys** for development and production
3. **Set spending limits** in both OpenAI and Anthropic dashboards
4. **Rotate keys regularly** for security

## Troubleshooting

### "Invalid API Key" Error
- Double-check your API key is copied correctly
- Ensure no extra spaces or quotes
- Verify the key hasn't been revoked

### "Rate Limit" Error
- Check your API usage limits
- Implement request throttling if needed
- Consider upgrading your API plan

### "Model Not Found" Error
- Ensure you're using the correct model name
- Check if you have access to the specific model
- Some models require special access

## Example `.env.local` File

```env
# OpenAI
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_ORG_ID=org-your-org-id-if-you-have-one

# Anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Defaults
DEFAULT_AI_MODEL=gpt-4
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=2048

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Next Steps

1. Set up your API keys
2. Choose your default model
3. Test the integration
4. Deploy to production

For more details, see the [AI Integration Guide](./AI_INTEGRATION_GUIDE.md). 