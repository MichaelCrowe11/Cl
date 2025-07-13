import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';

// API route for terminal command execution
export async function POST(req: NextRequest) {
  try {
    const { command, workingDir = 'workspace' } = await req.json();

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    // Enhanced security: Allow more mycology-specific commands
    const allowedCommands = [
      'python', 'ls', 'cat', 'pwd', 'echo', 'mkdir', 'touch', 'head', 'tail',
      'grep', 'find', 'wc', 'date', 'whoami', 'ps', 'clear', 'help'
    ];
    
    const commandParts = command.trim().split(' ');
    const baseCommand = commandParts[0];

    // Handle special commands
    if (command === 'clear') {
      return NextResponse.json({ output: '\x1b[2J\x1b[H' });
    }
    
    if (command === 'help') {
      return NextResponse.json({ 
        output: `Crowe Logic AI Terminal - Available Commands:
• python <script.py> - Run Python scripts
• ls - List directory contents
• cat <file> - View file contents
• mkdir <dir> - Create directory
• touch <file> - Create empty file
• pwd - Show current directory
• echo <text> - Display text
• date - Show current date/time
• help - Show this help message

Mycology Lab Tools:
• python substrate_calculator.py - Calculate substrate ratios
• python yield_predictor.py - Predict mushroom yields
• python contamination_analyzer.py - Analyze contamination risks` 
      });
    }

    if (!allowedCommands.includes(baseCommand)) {
      return NextResponse.json({ 
        output: `Command '${baseCommand}' not allowed. Type 'help' for available commands.` 
      });
    }

    return new Promise((resolve) => {
      const workspaceDir = path.join(process.cwd(), workingDir);
      
      // Ensure workspace directory exists
      fs.mkdir(workspaceDir, { recursive: true }).catch(() => {});
      
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
