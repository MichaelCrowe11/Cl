import { NextRequest } from 'next/server'
import { POST } from '@/app/api/chat/route'

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-key'
process.env.ANTHROPIC_API_KEY = 'test-key'

// Mock OpenAI
jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Test response' } }],
        }),
      },
    },
  })),
}))

// Mock Anthropic
jest.mock('@anthropic-ai/sdk', () => ({
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ text: 'Test response' }],
      }),
    },
  })),
}))

describe('/api/chat', () => {
  describe('POST', () => {
    it('handles OpenAI model requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          model: 'gpt-4-turbo',
          sessionId: 'test-session',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data.message).toBe('Test response')
    })

    it('handles Anthropic model requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          model: 'claude-3-opus',
          sessionId: 'test-session',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('message')
      expect(data.message).toBe('Test response')
    })

    it('returns 400 for missing message', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          sessionId: 'test-session',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
    })

    it('returns 400 for invalid model', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          model: 'invalid-model',
          sessionId: 'test-session',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error')
      expect(data.error).toContain('Unsupported model')
    })

    it('handles rate limiting', async () => {
      // Simulate multiple rapid requests
      const requests = Array(10).fill(null).map(() =>
        new NextRequest('http://localhost:3000/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: 'Hello',
            model: 'gpt-4-turbo',
            sessionId: 'test-session',
          }),
        })
      )

      const responses = await Promise.all(requests.map(req => POST(req)))
      const rateLimited = responses.some(res => res.status === 429)

      expect(rateLimited).toBe(true)
    })

    it('includes model information in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Hello',
          model: 'o3',
          sessionId: 'test-session',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('model')
      expect(data.model).toBe('o3')
    })
  })
}) 