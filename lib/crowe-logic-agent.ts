import Anthropic from '@anthropic-ai/sdk';

// Specialized Crowe Logic Coding Agent
export class CroweLogicAgent {
  private client: Anthropic;
  
  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  // System prompt for the Crowe Logic coding agent
  private readonly SYSTEM_PROMPT = `You are the Crowe Logic Coding Agent, a specialized AI assistant for building and maintaining the Crowe Logic Platform for Mycology and Research.

## Your Core Responsibilities:

### 1. Platform Architecture
- Next.js 15 with TypeScript best practices
- Supabase integration for data persistence
- Vercel deployment optimization
- Real-time features for lab monitoring

### 2. Mycology Domain Expertise
- Substrate formulation algorithms
- Contamination detection systems
- Growth parameter optimization
- Yield prediction models
- Environmental monitoring integration

### 3. Code Implementation Standards
- Always use TypeScript with strict type safety
- Follow React Server Components patterns
- Implement proper error boundaries
- Use Radix UI for accessibility
- Apply Tailwind CSS with custom Crowe Logic theme

### 4. Feature Implementation Priorities
1. User authentication with role-based access
2. Experiment tracking and data logging
3. Real-time monitoring dashboards
4. AI-powered analysis tools
5. Report generation and export

### 5. Database Schema
- Users and teams management
- Cultivation batches tracking
- Environmental data time series
- Experiment protocols storage
- Analysis results archiving

When implementing code:
- Provide complete, production-ready solutions
- Include error handling and loading states
- Add comprehensive comments
- Follow Next.js 15 best practices
- Optimize for performance and SEO`;

  async createCodingAssistant(task: string, context?: string) {
    try {
      const message = await this.client.messages.create({
        model: "claude-3-opus-20240229", // Use stable model version
        max_tokens: 8192,
        temperature: 0.2, // Lower temperature for more consistent code
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${context ? `Context: ${context}\n\n` : ''}Task: ${task}`
              }
            ]
          }
        ],
        // Enable thinking for complex problem solving
        metadata: {
          user_id: "crowe-logic-platform"
        }
      });

      return {
        content: message.content,
        usage: message.usage,
        model: message.model
      };
    } catch (error) {
      console.error('Crowe Logic Agent Error:', error);
      throw error;
    }
  }

  // Specific methods for common tasks
  async implementFeature(featureName: string, requirements: string[]) {
    const task = `Implement a ${featureName} feature for the Crowe Logic Platform with the following requirements:\n${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;
    return this.createCodingAssistant(task);
  }

  async optimizeCode(code: string, optimization: 'performance' | 'readability' | 'security') {
    const task = `Optimize the following code for ${optimization}:\n\n\`\`\`typescript\n${code}\n\`\`\``;
    return this.createCodingAssistant(task);
  }

  async generateDatabaseSchema(entities: string[]) {
    const task = `Generate a Supabase database schema for the following entities: ${entities.join(', ')}. Include proper relationships, RLS policies, and indexes.`;
    return this.createCodingAssistant(task);
  }

  async createMycologyAlgorithm(algorithmType: string, parameters: any) {
    const task = `Create a ${algorithmType} algorithm for mycology research with parameters: ${JSON.stringify(parameters, null, 2)}`;
    return this.createCodingAssistant(task);
  }
}

// Export singleton instance
export const croweLogicAgent = new CroweLogicAgent(); 