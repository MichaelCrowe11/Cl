import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// API route for file operations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const filePath = searchParams.get('path');

    switch (action) {
      case 'list':
        // List files in the workspace
        const workspaceDir = path.join(process.cwd(), 'workspace');
        
        try {
          // Create workspace directory if it doesn't exist
          await fs.mkdir(workspaceDir, { recursive: true });
          
          const files = await fs.readdir(workspaceDir, { withFileTypes: true });
          const fileList = files.map(file => ({
            name: file.name,
            type: file.isDirectory() ? 'folder' : 'file',
            path: path.join('workspace', file.name)
          }));
          
          return NextResponse.json({ files: fileList });
        } catch (error) {
          return NextResponse.json({ files: [] });
        }

      case 'read':
        if (!filePath) {
          return NextResponse.json({ error: 'File path required' }, { status: 400 });
        }
        
        try {
          const fullPath = path.join(process.cwd(), filePath);
          const content = await fs.readFile(fullPath, 'utf-8');
          return NextResponse.json({ content });
        } catch (error) {
          return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('File API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, path: filePath, content, name } = await req.json();

    switch (action) {
      case 'create':
        if (!name) {
          return NextResponse.json({ error: 'File name required' }, { status: 400 });
        }
        
        const workspaceDir = path.join(process.cwd(), 'workspace');
        await fs.mkdir(workspaceDir, { recursive: true });
        
        const newFilePath = path.join(workspaceDir, name);
        await fs.writeFile(newFilePath, content || '');
        
        return NextResponse.json({ 
          success: true, 
          file: { name, type: 'file', path: path.join('workspace', name) }
        });

      case 'save':
        if (!filePath || content === undefined) {
          return NextResponse.json({ error: 'File path and content required' }, { status: 400 });
        }
        
        const fullPath = path.join(process.cwd(), filePath);
        await fs.writeFile(fullPath, content);
        
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('File API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
