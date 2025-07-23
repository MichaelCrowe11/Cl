import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { prompt, fileType, template, context } = await req.json()

    if (!prompt || !fileType) {
      return NextResponse.json({ error: 'Prompt and file type are required' }, { status: 400 })
    }

    // Prepare specialized prompts based on file type
    const prompts = {
      'sop': `Generate a comprehensive Standard Operating Procedure (SOP) document in markdown format.
Requirements:
- Clear step-by-step instructions
- Safety considerations
- Equipment and materials lists
- Quality control checkpoints
- Version control information

User Request: ${prompt}
${context ? `Additional Context: ${context}` : ''}

Format as professional SOP with proper headings, numbered steps, and safety warnings.`,

      'batch-log': `Generate a detailed batch log template in JSON format for mycology production.
Requirements:
- Batch identification information
- Process parameters and conditions
- Quality control checkpoints
- Environmental monitoring data
- Personnel assignments
- Timeline and milestones

User Request: ${prompt}
${context ? `Additional Context: ${context}` : ''}

Create a structured JSON template with proper fields for tracking production batches.`,

      'protocol': `Generate a research protocol document in markdown format.
Requirements:
- Objective and hypothesis
- Materials and methods
- Experimental design
- Data collection procedures
- Analysis plan
- Expected outcomes

User Request: ${prompt}
${context ? `Additional Context: ${context}` : ''}

Format as a scientific protocol with clear methodology and reproducible steps.`,

      'report': `Generate a comprehensive research report in markdown format.
Requirements:
- Executive summary
- Background and objectives
- Methodology
- Results and findings
- Discussion and conclusions
- Recommendations

User Request: ${prompt}
${context ? `Additional Context: ${context}` : ''}

Create a professional report with data analysis and actionable insights.`,

      'code': `Generate clean, well-documented code based on the requirements.
Requirements:
- Proper code structure and organization
- Comprehensive comments and documentation
- Error handling and validation
- Type safety (if applicable)
- Best practices and patterns

User Request: ${prompt}
${context ? `Additional Context: ${context}` : ''}

Write production-ready code with proper error handling and documentation.`
    }

    const systemPrompt = prompts[fileType as keyof typeof prompts] || prompts.code

    // Call xAI API for content generation
    const xaiResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.XAI_MODEL || 'grok-beta',
        messages: [
          {
            role: 'system',
            content: `You are Crowe Logic AI, an expert assistant specialized in mycology research and laboratory operations. You generate professional-grade documents, protocols, and code for research facilities.

${systemPrompt}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!xaiResponse.ok) {
      throw new Error(`xAI API error: ${xaiResponse.status}`)
    }

    const xaiData = await xaiResponse.json()
    const generatedContent = xaiData.choices[0]?.message?.content

    if (!generatedContent) {
      throw new Error('No content generated from AI')
    }

    // Generate suggested filename based on content and type
    const timestamp = new Date().toISOString().split('T')[0]
    const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    
    const extensions = {
      'sop': '.md',
      'batch-log': '.json',
      'protocol': '.md',
      'report': '.md',
      'code': template?.includes('typescript') || template?.includes('.ts') ? '.ts' : 
               template?.includes('javascript') || template?.includes('.js') ? '.js' :
               template?.includes('python') || template?.includes('.py') ? '.py' : '.txt'
    }

    const suggestedFilename = `${sanitizedPrompt}-${timestamp}${extensions[fileType as keyof typeof extensions] || '.md'}`

    return NextResponse.json({
      content: generatedContent,
      fileType,
      suggestedFilename,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: session.user.email,
        prompt: prompt.slice(0, 100) + (prompt.length > 100 ? '...' : ''),
        aiModel: process.env.XAI_MODEL || 'grok-beta'
      }
    })

  } catch (error) {
    console.error('AI file generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate file content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
