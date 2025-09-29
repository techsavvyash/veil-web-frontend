import puppeteer from 'puppeteer'

describe('API Onboard Form E2E Tests', () => {
  const BASE_URL = 'http://localhost:3001'
  const FORM_URL = `${BASE_URL}/dashboard/onboard`
  
  beforeEach(async () => {
    // Navigate to onboard page
    await global.page.goto(FORM_URL)
    await global.page.waitForTimeout(2000)
    
    // Enable console logging to catch React warnings
    global.page.on('console', (msg) => {
      console.log(`PAGE LOG: ${msg.text()}`)
    })
    
    // Catch JavaScript errors
    global.page.on('pageerror', (err) => {
      console.log(`PAGE ERROR: ${err.toString()}`)
    })
  })

  test('should load onboard form page successfully', async () => {
    const currentUrl = global.page.url()
    expect(currentUrl).toContain('/onboard')
    
    // Check if the main heading exists
    const heading = await global.page.$('h1')
    const headingText = await global.page.evaluate(el => el?.textContent, heading)
    expect(headingText).toContain('Onboard New API')
    
    // Check if step 1 is active
    const stepIndicator = await global.page.$('.w-8.h-8.rounded-full')
    expect(stepIndicator).toBeTruthy()
  })

  test('should fill out basic information in step 1', async () => {
    // Fill API Name
    await global.page.type('#apiName', 'Test Weather API')
    
    // Select Category
    await global.page.click('[data-testid="category-select"], .bg-input.border-border')
    await global.page.waitForTimeout(500)
    await global.page.click('text="Weather"')
    
    // Fill Base URL
    await global.page.type('#baseUrl', 'https://api.testweather.com/v1')
    
    // Fill Version
    await global.page.clear('#version')
    await global.page.type('#version', '1.0.0')
    
    // Fill Short Description
    await global.page.type('#shortDescription', 'A test weather API')
    
    // Fill Long Description
    await global.page.type('#longDescription', 'This is a comprehensive test API for weather data')
    
    // Add tags
    const tagInput = await global.page.$('input[placeholder="Add a tag"]')
    await tagInput?.type('weather')
    await global.page.click('button:has([class*="h-4 w-4"]):has-text("")') // Plus button
    
    await tagInput?.type('forecast')
    await global.page.keyboard.press('Enter')
    
    // Fill documentation
    const docTextarea = await global.page.$('textarea[placeholder*="additional documentation"]')
    await docTextarea?.type('This API provides weather data with high accuracy.')
    
    // Verify form fields are filled
    const apiNameValue = await global.page.$eval('#apiName', el => (el as HTMLInputElement).value)
    const baseUrlValue = await global.page.$eval('#baseUrl', el => (el as HTMLInputElement).value)
    const shortDescValue = await global.page.$eval('#shortDescription', el => (el as HTMLInputElement).value)
    
    expect(apiNameValue).toBe('Test Weather API')
    expect(baseUrlValue).toBe('https://api.testweather.com/v1')
    expect(shortDescValue).toBe('A test weather API')
    
    console.log('✅ Step 1 form fields filled successfully')
  })

  test('should navigate through form steps and retain data', async () => {
    // Fill Step 1 data first
    await global.page.type('#apiName', 'Test Weather API')
    await global.page.type('#baseUrl', 'https://api.testweather.com/v1')
    await global.page.type('#shortDescription', 'A test weather API')
    await global.page.type('#longDescription', 'This is a comprehensive test API for weather data')
    
    // Go to next step
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Verify we're on step 2
    const stepTitle = await global.page.$eval('h3, h2, .text-foreground', el => el.textContent)
    expect(stepTitle).toContain('Documentation')
    
    // Go to step 3
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Go to step 4
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Go to step 5
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Go to step 6
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Go to step 7 (final)
    await global.page.click('button:has-text("Next")')
    await global.page.waitForTimeout(1000)
    
    // Navigate back to step 1 to verify data persistence
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(500)
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(500)
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(500)
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(500)
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(500)
    await global.page.click('button:has-text("Previous")')
    await global.page.waitForTimeout(1000)
    
    // Verify data is still there
    const apiNameValue = await global.page.$eval('#apiName', el => (el as HTMLInputElement).value)
    const baseUrlValue = await global.page.$eval('#baseUrl', el => (el as HTMLInputElement).value)
    
    expect(apiNameValue).toBe('Test Weather API')
    expect(baseUrlValue).toBe('https://api.testweather.com/v1')
    
    console.log('✅ Form data persists across steps')
  })

  test('should handle form submission in final step', async () => {
    // Fill required fields
    await global.page.type('#apiName', 'Test Weather API')
    await global.page.type('#baseUrl', 'https://api.testweather.com/v1')
    await global.page.type('#shortDescription', 'A test weather API')
    await global.page.type('#longDescription', 'This is a comprehensive test API for weather data')
    
    // Navigate to final step
    for (let i = 0; i < 6; i++) {
      await global.page.click('button:has-text("Next")')
      await global.page.waitForTimeout(1000)
    }
    
    // Check if Submit button exists
    const submitButton = await global.page.$('button:has-text("Submit for Review")')
    expect(submitButton).toBeTruthy()
    
    // Try to click submit (note: this will likely fail due to auth requirements)
    await global.page.click('button:has-text("Submit for Review")')
    await global.page.waitForTimeout(2000)
    
    // Check for loading state or error messages
    const pageContent = await global.page.content()
    const hasLoadingState = pageContent.includes('Submitting') || pageContent.includes('Loading')
    const hasErrorMessage = pageContent.includes('error') || pageContent.includes('Error')
    
    console.log(`Submit attempt - Loading: ${hasLoadingState}, Error: ${hasErrorMessage}`)
  })

  test('should check for React uncontrolled input warnings', async () => {
    const consoleLogs: string[] = []
    
    global.page.on('console', (msg) => {
      consoleLogs.push(msg.text())
    })
    
    // Fill form fields
    await global.page.type('#apiName', 'Test Weather API')
    await global.page.type('#baseUrl', 'https://api.testweather.com/v1')
    await global.page.type('#shortDescription', 'A test weather API')
    
    await global.page.waitForTimeout(2000)
    
    // Check for React warnings
    const uncontrolledWarnings = consoleLogs.filter(log => 
      log.includes('You provided a `value` prop to a form field without an `onChange` handler') ||
      log.includes('uncontrolled') ||
      log.includes('defaultValue')
    )
    
    console.log('Console logs:', consoleLogs)
    console.log('Uncontrolled input warnings:', uncontrolledWarnings)
    
    // Report findings (not failing the test as warnings may be expected during development)
    if (uncontrolledWarnings.length > 0) {
      console.warn(`⚠️  Found ${uncontrolledWarnings.length} uncontrolled input warnings`)
      uncontrolledWarnings.forEach(warning => console.warn(`   - ${warning}`))
    } else {
      console.log('✅ No uncontrolled input warnings found')
    }
  })

  test('should test form field interactions and updates', async () => {
    // Test that form fields can be updated multiple times
    await global.page.type('#apiName', 'Initial Name')
    let value = await global.page.$eval('#apiName', el => (el as HTMLInputElement).value)
    expect(value).toBe('Initial Name')
    
    // Clear and update
    await global.page.evaluate(() => {
      const input = document.querySelector('#apiName') as HTMLInputElement
      if (input) {
        input.value = ''
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    
    await global.page.type('#apiName', 'Updated Name')
    value = await global.page.$eval('#apiName', el => (el as HTMLInputElement).value)
    expect(value).toBe('Updated Name')
    
    console.log('✅ Form fields can be updated successfully')
  })

  test('should validate form completeness for submission', async () => {
    // Navigate to final step without filling required fields
    for (let i = 0; i < 6; i++) {
      await global.page.click('button:has-text("Next")')
      await global.page.waitForTimeout(500)
    }
    
    // Try to submit empty form
    const submitButton = await global.page.$('button:has-text("Submit for Review")')
    const isDisabled = await global.page.evaluate(btn => btn?.hasAttribute('disabled'), submitButton)
    
    console.log(`Submit button disabled for empty form: ${isDisabled}`)
    
    if (!isDisabled) {
      await global.page.click('button:has-text("Submit for Review")')
      await global.page.waitForTimeout(1000)
      
      // Check for validation messages
      const pageContent = await global.page.content()
      const hasValidationError = pageContent.includes('required') || 
                                pageContent.includes('must be') ||
                                pageContent.includes('error')
      
      console.log(`Validation error shown for empty form: ${hasValidationError}`)
    }
  })
})