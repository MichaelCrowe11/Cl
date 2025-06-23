# AI Model Integration Guide for Crowe Logic AI

This guide explains how to integrate your own AI models into the Crowe Logic AI platform.

## Overview

The platform is designed to support multiple AI models including:
- OpenAI GPT models
- Anthropic Claude
- Local models (Ollama, LocalAI)
- Custom fine-tuned models
- Domain-specific mycology models

## Quick Start

### 1. Environment Configuration

Create a `.env.local` file with your model credentials:

```env
# Default AI Model
DEFAULT_AI_ENDPOINT=https://api.openai.com/v1/chat/completions
DEFAULT_AI_API_KEY=your-api-key

# Custom Model
CUSTOM_LLM_ENDPOINT=https://your-model-endpoint.com/v1/chat
CUSTOM_LLM_API_KEY=your-custom-key

# Local Model
LOCAL_MODEL_ENDPOINT=http://localhost:8000/v1/chat/completions
```

### 2. Model Registration

Add your model to `lib/ai-config.ts`:

```typescript
export const AI_MODELS: Record<string, AIModelConfig> = {
  'your-model': {
    id: 'your-model',
    name: 'Your Model Name',
    description: 'Description of your model',
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048,
    supportedFeatures: ['chat', 'completion'],
  },
  // ... other models
}
```

### 3. API Route Configuration

Update the model registry in `app/api/ai/route.ts`:

```typescript
const MODEL_REGISTRY = {
  'your-model': {
    name: 'Your Model',
    endpoint: process.env.YOUR_MODEL_ENDPOINT,
    apiKey: process.env.YOUR_MODEL_API_KEY,
  },
  // ... other models
}
```

## Integration Examples

### OpenAI-Compatible Models

Most models follow the OpenAI API format:

```typescript
const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    model: modelName,
    temperature: 0.7,
    max_tokens: 2048,
  }),
})
```

### Custom Model Format

For models with different API formats, modify the request in `app/api/ai/route.ts`:

```typescript
// Example for a custom format
if (model === 'custom-format') {
  const customRequest = {
    input: prompt,
    parameters: {
      temp: temperature,
      length: max_tokens,
    }
  }
  // Custom API call
}
```

### Local Model Integration (Ollama)

For Ollama or similar local models:

```typescript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama2',
    prompt: prompt,
    stream: false,
  }),
})
```

## Domain-Specific Features

### Mycology Context Enhancement

The platform automatically enhances prompts with mycology context:

```typescript
import { formatMycologyPrompt } from '@/lib/ai-config'

const enhancedPrompt = formatMycologyPrompt(userInput, {
  species: 'Pleurotus ostreatus',
  substrate: 'straw',
  phase: 'colonization'
})
```

### Model Selection Logic

The system can automatically select the best model based on query type:

```typescript
import { selectModelForQuery } from '@/lib/ai-config'

const bestModel = selectModelForQuery(userQuery)
// Returns 'custom-mycology' for cultivation queries
// Returns 'gpt-4' for analysis queries
```

## Advanced Configuration

### 1. Streaming Responses

For real-time streaming responses:

```typescript
// In app/api/ai/route.ts
export async function POST(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      // Stream implementation
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

### 2. Function Calling

For models that support function calling:

```typescript
const functions = [
  {
    name: 'calculate_yield',
    description: 'Calculate mushroom yield prediction',
    parameters: {
      type: 'object',
      properties: {
        substrate_weight: { type: 'number' },
        species: { type: 'string' },
        conditions: { type: 'object' }
      }
    }
  }
]
```

### 3. Fine-Tuning Integration

To use fine-tuned models:

1. Upload your fine-tuned model to your provider
2. Add the model ID to the configuration
3. Include any special parameters required

## Testing Your Integration

### 1. Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How to optimize Lion's Mane substrate?",
    "model": "your-model",
    "temperature": 0.7
  }'
```

### 2. Test in UI

1. Start the development server: `pnpm dev`
2. Open http://localhost:3000
3. Send a test message
4. Check console for model selection and response

### 3. Model Switching

The UI displays the current model. To switch models:

```typescript
// In components/chat-interface.tsx
const [aiConfig, setAiConfig] = useState<AIModelConfig>({
  modelName: 'your-model', // Change default model
  temperature: 0.7,
  maxTokens: 2048,
})
```

## Deployment Considerations

### 1. Environment Variables

Ensure all API keys are set in your deployment environment:
- Vercel: Add via dashboard
- Docker: Use `.env` file
- Kubernetes: Use secrets

### 2. Rate Limiting

Implement rate limiting for production:

```typescript
import { rateLimit } from '@/lib/rate-limit'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})
```

### 3. Error Handling

The system includes fallback responses if models fail. Customize in `components/chat-interface.tsx`:

```typescript
catch (error) {
  // Custom error handling
  const fallbackResponse = generateFallbackResponse(error)
}
```

## Monitoring and Analytics

Track model usage and performance:

```typescript
// In app/api/ai/route.ts
const logUsage = async (model: string, tokens: number) => {
  // Log to your analytics service
  await analytics.track('ai_usage', {
    model,
    tokens,
    timestamp: new Date(),
  })
}
```

## Support

For help with integration:
1. Check the example implementations in `/examples`
2. Review the API documentation
3. Test with the development tools

## Next Steps

1. **Install dependencies**: `pnpm install`
2. **Configure environment**: Copy `.env.example` to `.env.local`
3. **Add your models**: Update `lib/ai-config.ts`
4. **Test locally**: `pnpm dev`
5. **Deploy**: `pnpm build && pnpm start`

The platform is now ready for your custom AI models! 