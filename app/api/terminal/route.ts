import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// API route for terminal command execution
export async function POST(req: NextRequest) {
  try {
    const { command, workingDir = 'workspace' } = await req.json();

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Security: Only allow specific safe commands for now
    const allowedCommands = ['python', 'ls', 'cat', 'pwd', 'echo'];
    const commandParts = command.trim().split(' ');
    const baseCommand = commandParts[0];

    if (!allowedCommands.includes(baseCommand)) {
      return NextResponse.json({ 
        error: `Command '${baseCommand}' not allowed. Allowed commands: ${allowedCommands.join(', ')}` 
      }, { status: 403 });
    }

    return new Promise((resolve) => {
      const workspaceDir = path.join(process.cwd(), workingDir);
      
      let output = '';
      let errorOutput = '';

      const child = spawn(baseCommand, commandParts.slice(1), {
        cwd: workspaceDir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      child.on('close', (code) => {
        resolve(NextResponse.json({
          output: output || 'Command executed successfully',
          error: errorOutput || null,
          exitCode: code,
          command: command
        }));
      });

      child.on('error', (error) => {
        resolve(NextResponse.json({
          output: '',
          error: error.message,
          exitCode: 1,
          command: command
        }));
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        child.kill();
        resolve(NextResponse.json({
          output: output,
          error: 'Command timed out after 30 seconds',
          exitCode: 124,
          command: command
        }));
      }, 30000);
    });

  } catch (error) {
    console.error('Terminal API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      output: '',
      exitCode: 1 
    }, { status: 500 });
  }
}
