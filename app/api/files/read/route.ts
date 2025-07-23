import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { promises as fs } from 'fs'
import path from 'path'

const LAB_DATA_DIR = path.join(process.cwd(), 'lab-data')
const WORKSPACE_DIR = path.join(process.cwd(), 'workspace')

export async function GET(request: NextRequest) {
  try {
    // Authentication check for workspace files
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    const isWorkspaceFile = filePath?.startsWith('workspace/')
    
    if (isWorkspaceFile) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }
    }
    
    if (!filePath) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 })
    }
    
    // Determine target directory based on file path
    let targetPath: string
    if (isWorkspaceFile) {
      targetPath = path.join(process.cwd(), filePath)
      // Security check for workspace files
      if (!targetPath.startsWith(WORKSPACE_DIR)) {
        return NextResponse.json({ error: 'Access denied to workspace files' }, { status: 403 })
      }
    } else {
      targetPath = path.join(LAB_DATA_DIR, filePath)
      // Security check for lab data files
      if (!targetPath.startsWith(LAB_DATA_DIR)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
      }
    }
    
    const content = await fs.readFile(targetPath, 'utf-8')
    const stats = await fs.stat(targetPath)
    
    return NextResponse.json({
      content,
      size: stats.size,
      modified: stats.mtime.toISOString(),
      created: stats.birthtime.toISOString(),
      path: filePath,
      type: isWorkspaceFile ? 'workspace' : 'lab-data'
    })
  } catch (error) {
    console.error('File read error:', error)
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    )
  }
}
