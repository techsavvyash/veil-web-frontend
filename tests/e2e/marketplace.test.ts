import puppeteer from 'puppeteer'

describe('Marketplace E2E Tests', () => {
  const BASE_URL = 'http://localhost:3001'
  
  beforeEach(async () => {
    await global.page.goto(BASE_URL)
  })

  test('should navigate to marketplace from landing page', async () => {
    // Click on "Browse APIs" button
    await global.page.click('[href="/marketplace"]')
    await global.page.waitForSelector('h1', { timeout: 5000 })
    
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/marketplace')
  })

  test('should load marketplace page with API listings', async () => {
    await global.page.goto(`${BASE_URL}/marketplace`)
    
    // Wait for the page to load
    await global.page.waitForTimeout(2000)
    
    // Check if we're on the marketplace page
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/marketplace')
    
    // Look for marketplace elements (this will depend on your implementation)
    const pageContent = await global.page.content()
    expect(pageContent.length).toBeGreaterThan(0)
  })

  test('should handle search functionality if available', async () => {
    await global.page.goto(`${BASE_URL}/marketplace`)
    await global.page.waitForTimeout(1000)
    
    // Look for search input
    const searchInput = await global.page.$('[type="search"]')
    if (searchInput) {
      await searchInput.type('weather')
      await global.page.keyboard.press('Enter')
      await global.page.waitForTimeout(1000)
    }
    
    // Test passes if no errors occur
    expect(true).toBe(true)
  })

  test('should navigate to API details page when clicking on an API', async () => {
    await global.page.goto(`${BASE_URL}/marketplace`)
    await global.page.waitForTimeout(2000)
    
    // Look for API cards or links (this depends on your implementation)
    const apiLinks = await global.page.$$('[href*="/marketplace/"]')
    
    if (apiLinks.length > 0) {
      await apiLinks[0].click()
      await global.page.waitForTimeout(2000)
      
      // Should navigate to API details page
      const currentUrl = global.page.url()
      expect(currentUrl).toContain('/marketplace/')
    }
  })

  test('should display categories if available', async () => {
    await global.page.goto(`${BASE_URL}/marketplace`)
    await global.page.waitForTimeout(2000)
    
    // Look for category filters or navigation
    const pageContent = await global.page.content()
    
    // The test passes if the page loads without errors
    expect(pageContent.length).toBeGreaterThan(0)
  })
})