import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { path, content = '' } = await request.json()
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }

    // Security: prevent path traversal
    if (path.includes('..') || path.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    const workspaceRoot = process.cwd()
    const filePath = join(workspaceRoot, path)
    
    // Check if file already exists
    if (existsSync(filePath)) {
      return NextResponse.json({ error: 'File already exists' }, { status: 400 })
    }

    // Create directory if it doesn't exist
    const dirPath = dirname(filePath)
    await mkdir(dirPath, { recursive: true })
    
    // Create the file
    await writeFile(filePath, content, 'utf-8')
    
    return NextResponse.json({ 
      success: true, 
      message: `File created: ${path}`,
      path 
    })
  } catch (error) {
    console.error('Error creating file:', error)
    return NextResponse.json({ 
      error: 'Failed to create file' 
    }, { status: 500 })
  }
}
