export const mockSupabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    signInWithPassword: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    signInWithOAuth: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    signUp: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  },
  from: jest.fn((table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
  channel: jest.fn((name: string) => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn((callback?: (status: string) => void) => {
      if (callback) callback('SUBSCRIBED')
      return Promise.resolve()
    }),
    unsubscribe: jest.fn(),
    send: jest.fn(),
    track: jest.fn(),
    presenceState: jest.fn(() => ({})),
  })),
  storage: {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(() => Promise.resolve({ data: { path: 'test/path' }, error: null })),
      download: jest.fn(() => Promise.resolve({ data: new Blob(), error: null })),
      remove: jest.fn(() => Promise.resolve({ data: [], error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://test.url/file' } })),
    })),
  },
}

// Helper to create authenticated user mock
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    avatar_url: 'https://test.com/avatar.jpg',
    full_name: 'Test User',
  },
  created_at: new Date().toISOString(),
  ...overrides,
})

// Helper to create mock session
export const createMockSession = (overrides = {}) => ({
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_at: Date.now() + 3600000,
  user: createMockUser(),
  ...overrides,
}) 