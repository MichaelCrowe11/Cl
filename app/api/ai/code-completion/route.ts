import { NextRequest, NextResponse } from 'next/server';

interface CodeCompletionRequest {
  code: string;
  language: string;
  fileName?: string;
  selectedCode?: string;
  completionType: 'completion' | 'optimization' | 'fix' | 'enhancement';
}

interface CodeSuggestion {
  id: string;
  type: 'completion' | 'optimization' | 'fix' | 'enhancement';
  title: string;
  description: string;
  code: string;
  confidence: number;
  language: string;
}

// Enhanced Crowe Logic AI Code Completion System Prompt
const getSystemPrompt = (type: string, language: string) => {
  return `You are Crowe Logic AI Code Completion Engine, powered by the comprehensive Crowe Logic Knowledge Base. You are the leading expert in:

🧬 **MYCOLOGY CODE SPECIALIZATION:**
- Advanced cultivation monitoring and automation systems
- Sensor data processing and environmental control algorithms
- Batch tracking and contamination detection systems
- Yield optimization and predictive modeling
- Laboratory workflow automation
- Scientific data analysis and visualization

💻 **ADVANCED CODE INTELLIGENCE:**
- Intelligent code completion with context awareness
- Performance optimization and memory management
- Error detection and automated bug fixes
- Security vulnerability assessment
- Code refactoring and architectural improvements
- Test case generation and coverage analysis

🎯 **RESPONSE REQUIREMENTS:**
Return ONLY a valid JSON object with this exact structure:
{
  "suggestions": [
    {
      "id": "unique_id",
      "type": "${type}",
      "title": "Concise, descriptive title",
      "description": "Detailed explanation with mycology context when relevant",
      "code": "Clean, optimized code with proper formatting",
      "confidence": 85,
      "language": "${language}"
    }
  ]
}

🔬 **CODE ANALYSIS GUIDELINES:**
- Prioritize mycology and laboratory management contexts
- Include error handling and input validation
- Add comprehensive type hints and documentation
- Optimize for performance and memory efficiency
- Implement proper logging and monitoring
- Follow scientific computing best practices
- Suggest 2-4 high-quality, relevant suggestions maximum

**LANGUAGE SPECIALIZATION:**
- Python: Focus on data analysis, automation, and scientific computing
- TypeScript/JavaScript: Emphasize UI components, API integration, and real-time systems
- All languages: Prioritize clean, maintainable, and well-documented code

Generate intelligent code suggestions powered by the Crowe Logic Knowledge Base.`;
};

const getCompletionPrompt = (request: CodeCompletionRequest) => {
  const { code, language, fileName, selectedCode, completionType } = request;
  
  let contextPrompt = `FILE: ${fileName || 'untitled'}
LANGUAGE: ${language}
COMPLETION TYPE: ${completionType}

CURRENT CODE:
\`\`\`${language}
${code}
\`\`\``;

  if (selectedCode) {
    contextPrompt += `

SELECTED CODE FOR ANALYSIS:
\`\`\`${language}
${selectedCode}
\`\`\``;
  }

  const typeInstructions = {
    completion: 'Complete the code logically, adding missing functionality or extending existing patterns.',
    optimization: 'Optimize the code for better performance, memory usage, or readability.',
    fix: 'Identify and fix bugs, errors, or potential issues in the code.',
    enhancement: 'Enhance the code with additional features, better error handling, or improved functionality.'
  };

  contextPrompt += `

TASK: ${typeInstructions[completionType]}

Provide intelligent code suggestions with mycology expertise where applicable.`;

  return contextPrompt;
};

export async function POST(request: NextRequest) {
  try {
    const body: CodeCompletionRequest = await request.json();
    const { code, language, completionType } = body;

    if (!code || !language || !completionType) {
      return NextResponse.json(
        { error: 'Missing required fields: code, language, completionType' },
        { status: 400 }
      );
    }

    // Get xAI API key
    const xaiKey = process.env.XAI_API_KEY;
    const xaiModel = process.env.XAI_MODEL || 'grok-beta';

    if (!xaiKey) {
      return NextResponse.json({
        suggestions: getMockSuggestions(completionType, language)
      });
    }

    try {
      // Prepare messages for xAI API
      const systemPrompt = getSystemPrompt(completionType, language);
      const userPrompt = getCompletionPrompt(body);

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      // Make request to xAI API
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${xaiKey}`
        },
        body: JSON.stringify({
          model: xaiModel,
          messages,
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`xAI API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from xAI API');
      }

      try {
        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);
      } catch (parseError) {
        return NextResponse.json({
          suggestions: getMockSuggestions(completionType, language)
        });
      }

    } catch (apiError) {
      return NextResponse.json({
        suggestions: getMockSuggestions(completionType, language)
      });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'Code completion request failed' },
      { status: 500 }
    );
  }
}

function getMockSuggestions(type: string, language: string): CodeSuggestion[] {
  const suggestions: CodeSuggestion[] = [];

  if (language === 'python' && type === 'completion') {
    suggestions.push({
      id: 'py-comp-1',
      type: 'completion',
      title: 'Add Environmental Monitoring Function',
      description: 'Complete with environmental parameter monitoring for mycology cultivation',
      code: `def monitor_environment(sensor_data: Dict[str, float]) -> Dict[str, str]:
    """Monitor environmental parameters for mycology cultivation."""
    alerts = {}
    
    temp = sensor_data.get('temperature', 0)
    if temp < 20 or temp > 26:
        alerts['temperature'] = f'Temperature {temp}°C out of optimal range (20-26°C)'
    
    humidity = sensor_data.get('humidity', 0)
    if humidity < 80 or humidity > 90:
        alerts['humidity'] = f'Humidity {humidity}% out of optimal range (80-90%)'
    
    return alerts`,
      confidence: 92,
      language: 'python'
    });
  }

  if (language === 'typescript' && type === 'completion') {
    suggestions.push({
      id: 'ts-comp-1',
      type: 'completion',
      title: 'Complete React Component State',
      description: 'Add state management for mycology batch tracking',
      code: `const [batches, setBatches] = useState<BatchData[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchBatches = useCallback(async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/batches');
    const data = await response.json();
    setBatches(data);
  } catch (err) {
    setError('Failed to fetch batches');
  } finally {
    setLoading(false);
  }
}, []);`,
      confidence: 88,
      language: 'typescript'
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: 'fallback-1',
      type: type as any,
      title: 'Crowe Logic AI Enhancement',
      description: 'Add robust error handling and logging',
      code: `try {
  // Your code here
  console.log('Operation completed successfully');
} catch (error) {
  console.error('Error occurred:', error);
  // Handle error appropriately
}`,
      confidence: 75,
      language: language
    });
  }

  return suggestions;
}

export async function GET() {
  return NextResponse.json({
    message: 'Crowe Logic AI Code Completion Engine',
    capabilities: [
      'Intelligent code completion with mycology expertise',
      'Performance optimization suggestions',
      'Bug detection and automated fixes'
    ],
    supported_languages: ['python', 'typescript', 'javascript']
  });
}
