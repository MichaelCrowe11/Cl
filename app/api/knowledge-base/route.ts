/**
 * API Route for Knowledge Base Access
 * Serves knowledge base content to the frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const topic = searchParams.get('topic');
    const query = searchParams.get('query');

    switch (action) {
      case 'config':
        // Serve knowledge base configuration
        const configPath = join(process.cwd(), 'knowledge-base', 'knowledge-config.json');
        const configContent = await readFile(configPath, 'utf-8');
        return NextResponse.json(JSON.parse(configContent));

      case 'content':
        // Serve specific knowledge base file content
        if (!topic) {
          return NextResponse.json({ error: 'Topic parameter required' }, { status: 400 });
        }
        
        const contentPath = join(process.cwd(), 'knowledge-base', `${topic}.md`);
        const content = await readFile(contentPath, 'utf-8');
        return NextResponse.json({ content });

      case 'search':
        // Simple search across knowledge base
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
        }
        
        // This would be enhanced with proper search indexing in production
        const searchResults = await performSimpleSearch(query);
        return NextResponse.json({ results: searchResults });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Knowledge base API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function performSimpleSearch(query: string) {
  const knowledgeFiles = [
    'core-principles',
    'environmental-controls',
    'platform-features',
    'substrate-recipes',
    'troubleshooting',
    'ui-components'
  ];

  const results = [];
  const queryTerms = query.toLowerCase().split(/\s+/);

  for (const file of knowledgeFiles) {
    try {
      const filePath = join(process.cwd(), 'knowledge-base', `${file}.md`);
      const content = await readFile(filePath, 'utf-8');
      
      // Simple relevance scoring
      let score = 0;
      const lines = content.split('\n');
      const matchingLines: string[] = [];

      lines.forEach(line => {
        const lineScore = queryTerms.reduce((acc, term) => {
          return acc + (line.toLowerCase().includes(term) ? 1 : 0);
        }, 0);
        
        if (lineScore > 0) {
          score += lineScore;
          matchingLines.push(line.trim());
        }
      });

      if (score > 0) {
        results.push({
          file,
          score,
          excerpt: matchingLines.slice(0, 3).join(' ').substring(0, 200) + '...',
          matchingLines: matchingLines.slice(0, 5)
        });
      }
    } catch (error) {
      console.error(`Error searching ${file}:`, error);
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
