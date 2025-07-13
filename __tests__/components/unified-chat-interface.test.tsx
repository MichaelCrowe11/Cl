import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UnifiedChatInterface } from '@/components/unified-chat-interface'
import { AuthProvider } from '@/contexts/auth-context'
import { mockSupabase, createMockUser } from '../__mocks__/supabase'

// Mock the fetch API
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('UnifiedChatInterface', () => {
  const mockUser = createMockUser()
  
  beforeEach(() => {
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    
    // Reset fetch mock
    mockFetch.mockClear()
  })

  const renderWithAuth = (component: React.ReactElement) => {
    return render(
      <AuthProvider>
        {component}
      </AuthProvider>
    )
  }

  describe('Rendering', () => {
    it('renders the chat interface correctly', () => {
      renderWithAuth(<UnifiedChatInterface />)
      
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
      expect(screen.getByText(/select ai model/i)).toBeInTheDocument()
    })

    it('displays model selector with all options', async () => {
      renderWithAuth(<UnifiedChatInterface />)
      
      const modelSelector = screen.getByText(/select ai model/i)
      fireEvent.click(modelSelector)
      
      await waitFor(() => {
        expect(screen.getByText('OpenAI o3')).toBeInTheDocument()
        expect(screen.getByText('OpenAI o4-mini')).toBeInTheDocument()
        expect(screen.getByText('GPT-4 Turbo')).toBeInTheDocument()
        expect(screen.getByText('Claude 3 Opus')).toBeInTheDocument()
      })
    })

    it('shows quick action buttons', () => {
      renderWithAuth(<UnifiedChatInterface />)
      
      expect(screen.getByText(/yield prediction/i)).toBeInTheDocument()
      expect(screen.getByText(/substrate calc/i)).toBeInTheDocument()
      expect(screen.getByText(/contamination/i)).toBeInTheDocument()
    })
  })

  describe('Message Handling', () => {
    it('sends a message when form is submitted', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          message: 'Test response',
          model: 'gpt-4-turbo'
        }),
      } as Response)

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      const sendButton = screen.getByRole('button', { name: /send/i })
      
      await user.type(input, 'Hello AI')
      await user.click(sendButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/chat',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('Hello AI'),
          })
        )
      })
    })

    it('displays error message when API call fails', async () => {
      const user = userEvent.setup()
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      await user.type(input, 'Test message')
      await user.type(input, '{enter}')
      
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
      })
    })

    it('disables input while message is being sent', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      const sendButton = screen.getByRole('button', { name: /send/i })
      
      await user.type(input, 'Test message')
      await user.click(sendButton)
      
      expect(input).toBeDisabled()
      expect(sendButton).toBeDisabled()
    })
  })

  describe('Model Selection', () => {
    it('changes model when selection is made', async () => {
      const user = userEvent.setup()
      renderWithAuth(<UnifiedChatInterface />)
      
      const modelSelector = screen.getByText(/select ai model/i)
      await user.click(modelSelector)
      
      const claudeOption = await screen.findByText('Claude 3 Opus')
      await user.click(claudeOption)
      
      expect(screen.getByText(/claude 3 opus/i)).toBeInTheDocument()
    })

    it('sends correct model parameter with message', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Response', model: 'claude-3-opus' }),
      } as Response)

      renderWithAuth(<UnifiedChatInterface />)
      
      // Select Claude model
      const modelSelector = screen.getByText(/select ai model/i)
      await user.click(modelSelector)
      const claudeOption = await screen.findByText('Claude 3 Opus')
      await user.click(claudeOption)
      
      // Send message
      const input = screen.getByPlaceholderText(/type your message/i)
      await user.type(input, 'Test')
      await user.type(input, '{enter}')
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/chat',
          expect.objectContaining({
            body: expect.stringContaining('"model":"claude-3-opus"'),
          })
        )
      })
    })
  })

  describe('Quick Actions', () => {
    it('triggers ML endpoint for yield prediction', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          predicted_yield_kg: 2.5,
          efficiency_percent: 85
        }),
      } as Response)

      renderWithAuth(<UnifiedChatInterface />)
      
      const yieldButton = screen.getByText(/yield prediction/i)
      await user.click(yieldButton)
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/ml',
          expect.objectContaining({
            body: expect.stringContaining('"service":"yield-prediction"'),
          })
        )
      })
    })

    it('shows loading state during ML service call', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      renderWithAuth(<UnifiedChatInterface />)
      
      const substrateButton = screen.getByText(/substrate calc/i)
      await user.click(substrateButton)
      
      expect(screen.getByText(/calculating/i)).toBeInTheDocument()
    })
  })

  describe('Message History', () => {
    it('saves messages to session storage', async () => {
      const user = userEvent.setup()
      const sessionId = 'test-session-id'
      
      // Mock Supabase insert
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue({
          data: { id: sessionId },
          error: null,
        }),
      })

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      await user.type(input, 'Test message')
      await user.type(input, '{enter}')
      
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('chat_sessions')
      })
    })

    it('displays message timestamps', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Response' }),
      } as Response)

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      await user.type(input, 'Test')
      await user.type(input, '{enter}')
      
      await waitFor(() => {
        const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/i)
        expect(timestamps).toHaveLength(2) // User and AI message
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderWithAuth(<UnifiedChatInterface />)
      
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label')
      expect(screen.getByRole('button', { name: /send/i })).toHaveAttribute('aria-label')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      renderWithAuth(<UnifiedChatInterface />)
      
      await user.tab()
      expect(screen.getByPlaceholderText(/type your message/i)).toHaveFocus()
      
      await user.tab()
      expect(screen.getByRole('button', { name: /send/i })).toHaveFocus()
    })

    it('announces loading states to screen readers', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      )

      renderWithAuth(<UnifiedChatInterface />)
      
      const input = screen.getByPlaceholderText(/type your message/i)
      await user.type(input, 'Test')
      await user.type(input, '{enter}')
      
      const loadingElement = screen.getByRole('status')
      expect(loadingElement).toHaveAttribute('aria-live', 'polite')
    })
  })
}) 