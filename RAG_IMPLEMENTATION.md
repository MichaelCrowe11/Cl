# CroweOS RAG System Implementation

## Overview

CroweOS now features a complete Retrieval-Augmented Generation (RAG) system based on Google's ADK (Agent Development Kit) patterns, customized for TypeScript/Next.js integration. This system provides intelligent document search and AI-powered responses with proper citations.

## Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Query    │───▶│   RAG Engine    │───▶│   LLM Response  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │ Document Store  │
                    │   + Chunking    │
                    │   + Similarity  │
                    └─────────────────┘
```

### Key Components

1. **RAG Engine** (`lib/rag-engine.ts`)
   - Document management and chunking
   - Similarity-based retrieval
   - LLM integration with context injection
   - Usage tracking integration

2. **API Endpoint** (`app/api/rag/route.ts`)
   - RESTful interface for RAG queries
   - Authentication and usage tracking
   - Sample document initialization

3. **Chat Interface** (`components/rag-chat-interface.tsx`)
   - Interactive chat UI with citations
   - Real-time usage metrics
   - Suggested questions and examples

4. **Integration Component** (`components/rag-integration.tsx`)
   - Floating chat widget for main IDE
   - Minimizable and closeable interface
   - Easy integration into existing layouts

## Features

### ✅ Document Management
- **Chunking**: Automatic document splitting with overlap
- **Metadata**: Rich document metadata with sources and tags
- **Dynamic Loading**: Add/remove documents at runtime
- **Type Safety**: Full TypeScript support with interfaces

### ✅ Retrieval System
- **Similarity Search**: Keyword-based matching (extensible to vector embeddings)
- **Configurable Limits**: Top-K results and distance thresholds
- **Multi-document**: Search across multiple document sources
- **Performance Metrics**: Retrieval timing and confidence scores

### ✅ Generation & Citations
- **Context Injection**: Retrieved chunks provided to LLM
- **Proper Citations**: Source attribution with confidence scores
- **URL Links**: Direct links to original documentation
- **Token Tracking**: Integration with existing usage system

### ✅ User Interface
- **Chat Interface**: Modern, responsive chat UI
- **Real-time Updates**: Live usage metrics and timing
- **Sample Questions**: Suggested queries for onboarding
- **Citation Display**: Clear source attribution with links

### ✅ Integration
- **Usage Tracking**: Automatic token consumption tracking
- **Plan Enforcement**: Tier-based access control
- **Authentication**: NextAuth.js session management
- **Error Handling**: Graceful degradation and retry logic

## Sample Knowledge Base

The system includes three sample documents covering:

1. **Getting Started Guide**
   - CroweOS features and capabilities
   - Plan tiers and limitations
   - Basic usage instructions

2. **AI Features Documentation**
   - Chat interface usage
   - Code completion features
   - Usage limits and tracking

3. **API Reference**
   - Authentication methods
   - Available endpoints
   - Response formats and error handling

## Usage

### Basic Query
```typescript
const ragEngine = createCroweOSRAGEngine();
const response = await ragEngine.query("What are the CroweOS plan limits?", userId);
```

### API Endpoint
```bash
POST /api/rag
Content-Type: application/json

{
  "question": "How do I use the AI features in CroweOS?"
}
```

### React Component
```tsx
import { RAGChatInterface } from '@/components/rag-chat-interface';

<RAGChatInterface 
  placeholder="Ask about CroweOS..."
  maxHeight="600px"
/>
```

## Configuration

### RAG Engine Settings
```typescript
const config: RAGConfig = {
  similarityTopK: 5,          // Number of chunks to retrieve
  vectorDistanceThreshold: 0.3, // Minimum similarity score
  maxTokens: 4000,             // Maximum tokens per response
  model: 'gpt-4'               // LLM model to use
};
```

### Document Structure
```typescript
const document: RAGDocument = {
  id: 'unique-doc-id',
  title: 'Document Title',
  content: 'Full document content...',
  metadata: {
    source: 'docs.croweos.com/guide',
    type: 'documentation',
    tags: ['getting-started', 'features'],
    lastUpdated: '2025-07-15T00:00:00Z',
    url: 'https://docs.croweos.com/guide'
  }
};
```

## Performance Metrics

The system tracks and reports:
- **Retrieval Time**: Time to find relevant chunks
- **Generation Time**: Time for LLM to generate response
- **Total Time**: End-to-end query processing
- **Token Usage**: Tracked and integrated with billing
- **Confidence Scores**: Similarity scores for each citation

## Testing

### Test Page
Visit `/test/rag` to interact with the RAG system:
- Interactive chat interface
- Sample questions and examples
- Real-time performance metrics
- System status indicators

### Sample Questions
- "What are the usage limits for each plan?"
- "How do I use the AI features in CroweOS?"
- "What APIs are available for integration?"
- "How does usage tracking work?"

## Integration with CroweOS

### Usage Tracking
RAG queries automatically track token usage:
```typescript
// Automatic usage tracking in RAG engine
await this.trackUsage(userId, tokensUsed);
```

### Plan Enforcement
Different access levels based on user plans:
- **FREE**: Limited queries with usage tracking
- **PRO**: Higher limits with advanced features
- **ENTERPRISE**: Unlimited access with custom knowledge bases

### IDE Integration
Add to main IDE interface:
```tsx
import { RAGIntegration } from '@/components/rag-integration';

// Floating widget in IDE
<RAGIntegration initialOpen={false} />
```

## Future Enhancements

### Vector Embeddings
Replace keyword similarity with proper vector embeddings:
- OpenAI embeddings API
- Pinecone or Weaviate vector database
- Semantic similarity matching

### Custom Knowledge Bases
Enterprise features:
- Upload custom documentation
- Team-specific knowledge bases
- Advanced document processing

### Advanced Features
- Multi-language support
- Code-specific RAG (search code repositories)
- Real-time document updates
- Advanced analytics and insights

## Technical Details

### Dependencies
- `@prisma/client`: Database integration
- `next-auth`: Authentication
- `react`: UI components
- `lucide-react`: Icons
- `tailwindcss`: Styling

### File Structure
```
lib/
  rag-engine.ts          # Core RAG implementation
app/api/rag/
  route.ts               # API endpoints
components/
  rag-chat-interface.tsx # Chat UI component
  rag-integration.tsx    # IDE integration widget
  subscription-notification.tsx # Plan upgrades
app/test/rag/
  page.tsx               # Test and demo page
```

### Error Handling
- Graceful degradation when API fails
- Clear error messages for users
- Automatic retry logic for transient failures
- Fallback responses when no documents match

## Conclusion

The CroweOS RAG system provides a production-ready implementation of Google's ADK patterns, fully integrated with the existing platform architecture. It offers intelligent document search, AI-powered responses with citations, and seamless integration with the usage tracking and billing systems.

The modular design allows for easy extension and customization, while maintaining high performance and user experience standards expected in a professional IDE environment.
