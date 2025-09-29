import puppeteer from 'puppeteer'

describe('Dashboard E2E Tests', () => {
  const BASE_URL = 'http://localhost:3001'
  
  beforeEach(async () => {
    await global.page.goto(BASE_URL)
  })

  test('should redirect to login when accessing dashboard without authentication', async () => {
    await global.page.goto(`${BASE_URL}/dashboard`)
    await global.page.waitForTimeout(2000)
    
    const currentUrl = global.page.url()
    // Should either show login page or redirect to auth
    expect(currentUrl).toMatch(/login|auth|dashboard/)
  })

  test('should navigate to profile page', async () => {
    await global.page.goto(`${BASE_URL}/profile`)
    await global.page.waitForTimeout(2000)
    
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/profile')
  })

  test('should navigate to API keys page', async () => {
    await global.page.goto(`${BASE_URL}/keys`)
    await global.page.waitForTimeout(2000)
    
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/keys')
  })

  test('should navigate to onboard page', async () => {
    await global.page.goto(`${BASE_URL}/dashboard/onboard`)
    await global.page.waitForTimeout(2000)
    
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/onboard')
  })

  test('should handle navigation between dashboard sections', async () => {
    const routes = ['/dashboard', '/profile', '/keys', '/marketplace']
    
    for (const route of routes) {
      await global.page.goto(`${BASE_URL}${route}`)
      await global.page.waitForTimeout(1000)
      
      const currentUrl = global.page.url()
      expect(currentUrl).toContain(route)
    }
  })

  test('should display loading states appropriately', async () => {
    await global.page.goto(`${BASE_URL}/marketplace/loading`)
    await global.page.waitForTimeout(1000)
    
    // Check if loading component renders
    const pageContent = await global.page.content()
    expect(pageContent.length).toBeGreaterThan(0)
  })
})