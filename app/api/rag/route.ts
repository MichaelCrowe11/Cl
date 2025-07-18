import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createCroweOSRAGEngine, defaultRAGConfig } from '@/lib/rag-engine';
import { prisma } from '@/lib/usage-tracking';

// Initialize RAG engine
const ragEngine = createCroweOSRAGEngine(defaultRAGConfig);

// Sample CroweOS documentation for testing
const sampleDocs = [
  {
    id: 'croweos-getting-started',
    title: 'CroweOS Pro IDE Getting Started Guide',
    content: `CroweOS Pro IDE is a powerful, VS Code-inspired development environment with integrated AI capabilities. 

    Key Features:
    - AI-powered code completion and chat
    - Real-time collaboration
    - Integrated terminal and file management
    - Usage tracking and tier-based limits
    - Advanced debugging tools
    
    Getting Started:
    1. Sign up for a CroweOS account at www.croweos.com
    2. Choose your plan: FREE (1000 tokens/day), PRO ($29.99/month), or ENTERPRISE ($99.99/month)
    3. Open the IDE and start coding
    4. Use Ctrl+K to open the AI assistant
    5. Access the terminal with Ctrl+Shift+\`
    
    The FREE plan includes 1000 AI tokens per day and 3 file uploads. PRO users get 10,000 tokens and 25 file uploads daily. Enterprise users have unlimited usage.`,
    metadata: {
      source: 'docs.croweos.com/getting-started',
      type: 'documentation' as const,
      tags: ['getting-started', 'features', 'plans'],
      lastUpdated: new Date().toISOString(),
      url: 'https://docs.croweos.com/getting-started'
    }
  },
  {
    id: 'croweos-ai-features',
    title: 'CroweOS AI Features and Usage',
    content: `CroweOS Pro IDE includes powerful AI features to enhance your development workflow.

    AI Chat Interface:
    - Ask questions about your code
    - Get explanations and suggestions
    - Request code generation and refactoring
    - Access to multiple AI models (GPT-4, Claude, Gemini)
    
    Code Completion:
    - Intelligent autocomplete suggestions
    - Context-aware code generation
    - Multi-language support
    - Learning from your coding patterns
    
    Usage Limits:
    - FREE: 1000 tokens/day, 3 file uploads
    - PRO: 10,000 tokens/day, 25 file uploads  
    - ENTERPRISE: Unlimited usage
    
    The usage tracking system automatically monitors your AI token consumption and file uploads. When you approach your limits, you'll receive warnings. Exceeding limits will temporarily block AI features until your daily reset.`,
    metadata: {
      source: 'docs.croweos.com/ai-features',
      type: 'documentation' as const,
      tags: ['ai', 'chat', 'completion', 'limits'],
      lastUpdated: new Date().toISOString(),
      url: 'https://docs.croweos.com/ai-features'
    }
  },
  {
    id: 'croweos-api-reference',
    title: 'CroweOS API Reference',
    content: `CroweOS provides several API endpoints for integration and usage tracking.

    Authentication:
    All API requests require authentication via NextAuth.js sessions or API keys.
    
    Usage Tracking API (/api/usage):
    - GET: Retrieve current usage statistics
    - POST: Track token or file usage
    - Returns: usage counts, limits, plan information
    
    AI Chat API (/api/ai/chat):
    - POST: Send messages to AI assistant
    - Requires: message content, optional context
    - Returns: AI response, token usage, citations
    
    File Management API (/api/ide/files):
    - GET: List project files
    - POST: Upload new files
    - PUT: Update existing files
    - DELETE: Remove files
    
    Response Format:
    All APIs return JSON with consistent error handling and usage tracking integration.`,
    metadata: {
      source: 'docs.croweos.com/api-reference',
      type: 'api-ref' as const,
      tags: ['api', 'endpoints', 'authentication'],
      lastUpdated: new Date().toISOString(),
      url: 'https://docs.croweos.com/api-reference'
    }
  }
];

// Initialize sample documents
async function initializeSampleDocs() {
  for (const doc of sampleDocs) {
    await ragEngine.addDocument(doc);
  }
}

// Initialize once
let initialized = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    
    if (!testMode) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Initialize sample docs if not done
    if (!initialized) {
      await initializeSampleDocs();
      initialized = true;
    }

    return NextResponse.json({
      message: 'CroweOS RAG system ready',
      documentsLoaded: sampleDocs.length,
      config: defaultRAGConfig
    });

  } catch (error) {
    console.error('RAG initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize RAG system' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    
    let userId = null;
    
    if (!testMode) {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Get user for usage tracking
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      userId = user.id;
    }

    // Initialize sample docs if not done
    if (!initialized) {
      await initializeSampleDocs();
      initialized = true;
    }

    const body = await request.json();
    const { question, options } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Query RAG system
    const startTime = Date.now();
    const response = await ragEngine.query(question, userId || 'test-user');
    const totalTime = Date.now() - startTime;

    // Return RAG response
    return NextResponse.json({
      ...response,
      metadata: {
        ...response.metadata,
        totalTime,
        question,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('RAG query error:', error);
    return NextResponse.json(
      { error: 'Failed to process RAG query' },
      { status: 500 }
    );
  }
}
