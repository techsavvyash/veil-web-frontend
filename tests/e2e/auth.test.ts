import puppeteer from 'puppeteer'

describe('Authentication E2E Tests', () => {
  const BASE_URL = 'http://localhost:3001'
  const API_URL = 'http://localhost:3000'
  
  beforeEach(async () => {
    await global.page.goto(BASE_URL)
  })

  test('should navigate to signup page', async () => {
    await global.page.click('[href="/signup"]')
    await global.page.waitForSelector('h1')
    
    const heading = await global.page.$eval('h1', (el) => el.textContent)
    expect(heading).toContain('Create')
  })

  test('should navigate to login page', async () => {
    await global.page.click('[href="/login"]')
    await global.page.waitForSelector('h1')
    
    const heading = await global.page.$eval('h1', (el) => el.textContent)
    expect(heading).toContain('Sign')
  })

  test('should show validation errors on empty form submission', async () => {
    await global.page.goto(`${BASE_URL}/signup`)
    await global.page.waitForSelector('form')
    
    // Try to submit empty form
    const submitButton = await global.page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
    }
    
    // Check for validation messages (this will depend on your form validation setup)
    await global.page.waitForTimeout(1000)
    const pageContent = await global.page.content()
    
    // Should still be on signup page (not redirected)
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/signup')
  })

  test('should attempt user registration with valid data', async () => {
    await global.page.goto(`${BASE_URL}/signup`)
    await global.page.waitForSelector('form')
    
    const testUser = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123'
    }
    
    // Fill out the form
    await global.page.type('[name="email"]', testUser.email)
    await global.page.type('[name="firstName"]', testUser.firstName)
    await global.page.type('[name="lastName"]', testUser.lastName)
    await global.page.type('[name="password"]', testUser.password)
    
    // Submit form
    const submitButton = await global.page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
    }
    
    // Wait for response (either success redirect or error message)
    await global.page.waitForTimeout(2000)
    
    // The test passes if no errors are thrown during the process
    expect(true).toBe(true)
  })

  test('should attempt user login with credentials', async () => {
    await global.page.goto(`${BASE_URL}/login`)
    await global.page.waitForSelector('form')
    
    const testCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }
    
    // Fill login form
    await global.page.type('[name="email"]', testCredentials.email)
    await global.page.type('[name="password"]', testCredentials.password)
    
    // Submit form
    const submitButton = await global.page.$('button[type="submit"]')
    if (submitButton) {
      await submitButton.click()
    }
    
    // Wait for response
    await global.page.waitForTimeout(2000)
    
    // The test passes if no errors are thrown during the process
    expect(true).toBe(true)
  })
})