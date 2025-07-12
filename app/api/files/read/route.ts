import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LAB_DATA_DIR = path.join(process.cwd(), 'lab-data')

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 })
    }
    
    const targetPath = path.join(LAB_DATA_DIR, filePath)
    
    // Security check
    if (!targetPath.startsWith(LAB_DATA_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }
    
    const content = await fs.readFile(targetPath, 'utf-8')
    const stats = await fs.stat(targetPath)
    
    return NextResponse.json({
      content,
      size: stats.size,
      modified: stats.mtime.toISOString(),
      path: filePath
    })
  } catch (error) {
    console.error('File read error:', error)
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    )
  }
}
