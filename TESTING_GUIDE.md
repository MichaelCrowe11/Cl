# 🧪 Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the Crowe Logic AI platform, including unit tests, integration tests, and end-to-end tests.

## 📋 Test Types

### 1. **Unit Tests** (Jest + React Testing Library)
- Component testing
- Hook testing
- Utility function testing
- API route testing

### 2. **Integration Tests** (Jest)
- API endpoint testing
- Database operations
- Third-party service integration

### 3. **End-to-End Tests** (Playwright)
- User flow testing
- Cross-browser testing
- Mobile responsiveness

## 🚀 Getting Started

### Install Dependencies

```bash
# Install all testing dependencies
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest playwright @playwright/test
```

### Configure Jest

The project uses `jest.config.js` for configuration:
- Test environment: jsdom
- Module aliases support
- Coverage thresholds: 70%
- Setup file: `__tests__/setup.ts`

### Configure Playwright

The project uses `playwright.config.ts` for E2E configuration:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic dev server startup

## 📝 Writing Tests

### Component Tests

```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Hook Tests

```typescript
// __tests__/hooks/use-auth.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/hooks/use-auth'
import { AuthProvider } from '@/contexts/auth-context'

describe('useAuth', () => {
  it('returns user when authenticated', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    })

    await waitFor(() => {
      expect(result.current.user).toBeDefined()
    })
  })
})
```

### API Route Tests

```typescript
// __tests__/api/ml.test.ts
import { POST } from '@/app/api/ml/route'
import { NextRequest } from 'next/server'

describe('/api/ml', () => {
  it('processes yield prediction', async () => {
    const request = new NextRequest('http://localhost:3000/api/ml', {
      method: 'POST',
      body: JSON.stringify({
        service: 'yield-prediction',
        parameters: { species: 'oyster', substrate_weight: 10 }
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('predicted_yield_kg')
  })
})
```

### E2E Tests

```typescript
// e2e/chat-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can send chat message', async ({ page }) => {
  await page.goto('/chat')
  
  // Type message
  await page.getByPlaceholder('Type your message').fill('Hello AI')
  
  // Send message
  await page.getByRole('button', { name: 'Send' }).click()
  
  // Wait for response
  await expect(page.getByText(/thinking/i)).toBeVisible()
  await expect(page.getByRole('article')).toContainText('Hello')
})
```

## 🏃 Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="auth"
```

### E2E Tests

```bash
# Install Playwright browsers (first time)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e -- --ui

# Run specific browser
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug
```

## 📊 Test Coverage

### View Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Requirements

- Statements: 70%
- Branches: 70%
- Functions: 70%
- Lines: 70%

## 🎯 Testing Best Practices

### 1. **Test Structure**
```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Common setup
  })

  describe('feature/scenario', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### 2. **Naming Conventions**
- Test files: `*.test.ts(x)` or `*.spec.ts(x)`
- Describe blocks: Component/function name
- It blocks: Start with "should" or describe behavior

### 3. **Mock Best Practices**
```typescript
// Mock modules at top of file
jest.mock('@/lib/supabase')

// Mock implementation in tests
import { supabase } from '@/lib/supabase'
const mockSupabase = supabase as jest.Mocked<typeof supabase>

beforeEach(() => {
  mockSupabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: [], error: null })
  })
})
```

### 4. **Async Testing**
```typescript
// Always use async/await or return promises
it('handles async operations', async () => {
  const result = await someAsyncFunction()
  expect(result).toBe(expected)
})

// Use waitFor for DOM updates
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### 5. **Accessibility Testing**
```typescript
it('is accessible', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 🐛 Debugging Tests

### Jest Debugging

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code debugging
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--watchAll=false"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Playwright Debugging

```bash
# Debug mode with inspector
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Slow motion
npx playwright test --headed --slow-mo=1000

# Generate recordings
npx playwright test --trace on
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm test -- --coverage
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📚 Testing Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### Tools
- [Testing Playground](https://testing-playground.com/) - Find queries for elements
- [Jest Extended](https://github.com/jest-community/jest-extended) - Additional matchers
- [MSW](https://mswjs.io/) - Mock Service Worker for API mocking

## ✅ Testing Checklist

Before submitting PR:
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Coverage meets thresholds
- [ ] No console errors/warnings
- [ ] E2E tests pass on all browsers
- [ ] Tests are documented
- [ ] Mocks are cleaned up

## 🎉 Happy Testing!

Remember: Good tests are an investment in code quality and developer confidence. Write tests that give you confidence your code works as expected! 