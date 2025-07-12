import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const LAB_DATA_DIR = path.join(process.cwd(), 'lab-data')

// Ensure lab-data directory exists
async function ensureLabDataDir() {
  try {
    await fs.access(LAB_DATA_DIR)
  } catch {
    await fs.mkdir(LAB_DATA_DIR, { recursive: true })
    
    // Create initial directory structure
    await fs.mkdir(path.join(LAB_DATA_DIR, 'projects'), { recursive: true })
    await fs.mkdir(path.join(LAB_DATA_DIR, 'sops'), { recursive: true })
    await fs.mkdir(path.join(LAB_DATA_DIR, 'batches'), { recursive: true })
    await fs.mkdir(path.join(LAB_DATA_DIR, 'exports'), { recursive: true })
    
    // Create sample files
    await fs.writeFile(
      path.join(LAB_DATA_DIR, 'projects', 'substrate-optimization.json'),
      JSON.stringify({
        id: 'proj-001',
        name: 'Substrate Optimization Study',
        species: 'Pleurotus ostreatus',
        status: 'active',
        created: new Date().toISOString(),
        parameters: {
          temperature: '22-24°C',
          humidity: '85-90%',
          substrate: 'Straw + Wheat Bran'
        }
      }, null, 2)
    )
    
    await fs.writeFile(
      path.join(LAB_DATA_DIR, 'batches', 'batch-001-lions-mane.json'),
      JSON.stringify({
        id: 'batch-001',
        species: 'Hericium erinaceus',
        inoculated: new Date().toISOString(),
        status: 'incubating',
        substrate: 'Oak sawdust + bran',
        containers: 12,
        expectedHarvest: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }, null, 2)
    )
    
    await fs.writeFile(
      path.join(LAB_DATA_DIR, 'sops', 'sterilization-protocol.md'),
      `# Sterilization Protocol

## Overview
Standard sterilization procedure for substrate preparation

## Equipment
- Pressure cooker (15 PSI capacity)
- Steam gauge
- Timer

## Procedure
1. Load substrate in autoclave bags
2. Set pressure to 15 PSI
3. Sterilize for 90 minutes
4. Cool completely before handling

## Safety Notes
- Always wear heat-resistant gloves
- Check pressure gauge regularly
- Never open hot autoclave
`
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureLabDataDir()
    
    const { searchParams } = new URL(request.url)
    const dir = searchParams.get('dir') || ''
    
    const targetDir = path.join(LAB_DATA_DIR, dir)
    
    // Security check - prevent directory traversal
    if (!targetDir.startsWith(LAB_DATA_DIR)) {
      return NextResponse.json({ error: 'Invalid directory path' }, { status: 400 })
    }
    
    const items = await fs.readdir(targetDir, { withFileTypes: true })
    
    const fileTree = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(targetDir, item.name)
        const relativePath = path.relative(LAB_DATA_DIR, itemPath)
        
        if (item.isDirectory()) {
          // Get directory contents for folder structure
          try {
            await fs.readdir(itemPath) // Check if directory is accessible
            return {
              name: item.name,
              type: 'folder' as const,
              path: relativePath,
              children: [] // Always include empty children array for folders
            }
          } catch {
            return {
              name: item.name,
              type: 'folder' as const,
              path: relativePath,
              children: []
            }
          }
        } else {
          // Get file stats
          const stats = await fs.stat(itemPath)
          return {
            name: item.name,
            type: 'file' as const,
            path: relativePath,
            size: stats.size,
            modified: stats.mtime.toISOString()
          }
        }
      })
    )
    
    return NextResponse.json({ files: fileTree })
  } catch (error) {
    console.error('File explorer error:', error)
    return NextResponse.json(
      { error: 'Failed to read directory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureLabDataDir()
    
    const { action, path: filePath, content, type } = await request.json()
    
    const targetPath = path.join(LAB_DATA_DIR, filePath)
    
    // Security check
    if (!targetPath.startsWith(LAB_DATA_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }
    
    switch (action) {
      case 'create':
        if (type === 'folder') {
          await fs.mkdir(targetPath, { recursive: true })
        } else {
          await fs.writeFile(targetPath, content || '')
        }
        break
        
      case 'delete':
        const stats = await fs.stat(targetPath)
        if (stats.isDirectory()) {
          await fs.rmdir(targetPath, { recursive: true })
        } else {
          await fs.unlink(targetPath)
        }
        break
        
      case 'rename':
        const { newPath } = await request.json()
        const newTargetPath = path.join(LAB_DATA_DIR, newPath)
        if (!newTargetPath.startsWith(LAB_DATA_DIR)) {
          return NextResponse.json({ error: 'Invalid new file path' }, { status: 400 })
        }
        await fs.rename(targetPath, newTargetPath)
        break
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('File operation error:', error)
    return NextResponse.json(
      { error: 'File operation failed' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureLabDataDir()
    
    const { path: filePath, content } = await request.json()
    
    const targetPath = path.join(LAB_DATA_DIR, filePath)
    
    // Security check
    if (!targetPath.startsWith(LAB_DATA_DIR)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }
    
    await fs.writeFile(targetPath, content)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('File save error:', error)
    return NextResponse.json(
      { error: 'Failed to save file' },
      { status: 500 }
    )
  }
}
