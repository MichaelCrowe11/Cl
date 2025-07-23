import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import fs from 'fs/promises'
import path from 'path'
import { z } from 'zod'

// File operation validation schema
const FileWriteSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
  content: z.string(),
  operation: z.enum(['create', 'update', 'append']).default('create'),
  fileType: z.enum(['sop', 'batch-log', 'protocol', 'report', 'code', 'markdown', 'json', 'csv']).default('markdown'),
  metadata: z.object({
    author: z.string().optional(),
    department: z.string().optional(),
    batchId: z.string().optional(),
    protocolVersion: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
})

type FileWriteRequest = z.infer<typeof FileWriteSchema>

// Security: Define allowed file operations and paths
const ALLOWED_EXTENSIONS = {
  'sop': ['.md', '.txt'],
  'batch-log': ['.json', '.csv', '.md'],
  'protocol': ['.md', '.json'],
  'report': ['.md', '.json', '.csv'],
  'code': ['.ts', '.tsx', '.js', '.jsx', '.py', '.sql'],
  'markdown': ['.md'],
  'json': ['.json'],
  'csv': ['.csv']
}

const WORKSPACE_DIRECTORIES = {
  'sop': 'workspace/sops',
  'batch-log': 'workspace/batch-logs',
  'protocol': 'workspace/protocols', 
  'report': 'workspace/reports',
  'code': 'workspace/code',
  'markdown': 'workspace/docs',
  'json': 'workspace/data',
  'csv': 'workspace/data'
}

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Parse and validate request
    const body = await req.json()
    const validation = FileWriteSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: validation.error.issues 
      }, { status: 400 })
    }

    const { filePath, content, operation, fileType, metadata } = validation.data

    // Security: Validate file path and extension
    const fileExtension = path.extname(filePath).toLowerCase()
    const allowedExtensions = ALLOWED_EXTENSIONS[fileType]
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Invalid file extension. Allowed for ${fileType}: ${allowedExtensions.join(', ')}` 
      }, { status: 400 })
    }

    // Ensure file is within allowed workspace directory
    const workspaceDir = WORKSPACE_DIRECTORIES[fileType]
    const fullPath = path.join(process.cwd(), workspaceDir, path.basename(filePath))
    
    // Security: Prevent path traversal attacks
    if (!fullPath.startsWith(path.join(process.cwd(), workspaceDir))) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(fullPath), { recursive: true })

    // Check if file exists for operations
    let fileExists = false
    try {
      await fs.access(fullPath)
      fileExists = true
    } catch {
      // File doesn't exist
    }

    if (operation === 'update' && !fileExists) {
      return NextResponse.json({ error: 'File does not exist for update operation' }, { status: 404 })
    }

    if (operation === 'create' && fileExists) {
      return NextResponse.json({ error: 'File already exists. Use update operation instead.' }, { status: 409 })
    }

    // Prepare file content with metadata if provided
    let finalContent = content
    if (metadata && ['sop', 'batch-log', 'protocol', 'report'].includes(fileType)) {
      const frontMatter = {
        ...metadata,
        createdAt: new Date().toISOString(),
        createdBy: session.user.email,
        fileType,
        lastModified: new Date().toISOString(),
      }
      
      if (fileExtension === '.md') {
        finalContent = `---\n${Object.entries(frontMatter)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? JSON.stringify(value) : value}`)
          .join('\n')}\n---\n\n${content}`
      } else if (fileExtension === '.json') {
        finalContent = JSON.stringify({
          metadata: frontMatter,
          content: JSON.parse(content)
        }, null, 2)
      }
    }

    // Write file based on operation
    switch (operation) {
      case 'create':
      case 'update':
        await fs.writeFile(fullPath, finalContent, 'utf8')
        break
      case 'append':
        await fs.appendFile(fullPath, `\n${finalContent}`, 'utf8')
        break
    }

    // Log file operation for audit trail
    console.log(`File ${operation} completed: ${fullPath} by ${session.user.email}`)

    return NextResponse.json({
      success: true,
      filePath: path.relative(process.cwd(), fullPath),
      operation,
      fileType,
      timestamp: new Date().toISOString(),
      message: `File ${operation} completed successfully`
    })

  } catch (error) {
    console.error('File write error:', error)
    return NextResponse.json({ 
      error: 'Internal server error during file operation' 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const url = new URL(req.url)
    const fileType = url.searchParams.get('type') as keyof typeof WORKSPACE_DIRECTORIES
    
    if (!fileType || !WORKSPACE_DIRECTORIES[fileType]) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    const workspaceDir = path.join(process.cwd(), WORKSPACE_DIRECTORIES[fileType])
    
    try {
      const files = await fs.readdir(workspaceDir, { withFileTypes: true })
      const fileList = files
        .filter(file => file.isFile())
        .map(file => ({
          name: file.name,
          path: path.join(WORKSPACE_DIRECTORIES[fileType], file.name),
          type: fileType
        }))

      return NextResponse.json({ files: fileList })
    } catch {
      // Directory doesn't exist yet
      return NextResponse.json({ files: [] })
    }

  } catch (error) {
    console.error('File list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
