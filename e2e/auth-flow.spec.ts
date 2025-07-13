import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/auth/login')
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check for form elements
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    
    // Check for OAuth buttons
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /github/i })).toBeVisible()
  })

  test('should show validation errors for invalid inputs', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByPlaceholder('Email').fill('invalid@example.com')
    await page.getByPlaceholder('Password').fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login')
    
    await page.getByText(/don't have an account/i).click()
    await expect(page).toHaveURL('/auth/register')
    
    // Check register form
    await expect(page.getByPlaceholder('Full Name')).toBeVisible()
    await expect(page.getByPlaceholder('Email')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
  })

  test('should successfully login and redirect to dashboard', async ({ page }) => {
    // This test would require a test user in your database
    // For now, we'll mock the authentication
    
    // Set auth cookie to simulate logged in state
    await page.context().addCookies([{
      name: 'sb-auth-token',
      value: 'mock-token',
      domain: 'localhost',
      path: '/',
    }])
    
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
    
    // Check dashboard elements
    await expect(page.getByText(/welcome back/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Set auth cookie
    await page.context().addCookies([{
      name: 'sb-auth-token',
      value: 'mock-token',
      domain: 'localhost',
      path: '/',
    }])
    
    await page.goto('/dashboard')
    await page.getByRole('button', { name: /logout/i }).click()
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
    
    // Should not be able to access protected routes
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/auth/login')
  })
}) 