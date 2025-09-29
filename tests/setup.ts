import puppeteer from 'puppeteer'

declare global {
  var browser: puppeteer.Browser
  var page: puppeteer.Page
}

beforeAll(async () => {
  global.browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  global.page = await global.browser.newPage()
  
  // Set viewport for consistent testing
  await global.page.setViewport({ width: 1280, height: 720 })
})

afterAll(async () => {
  await global.browser.close()
})

beforeEach(async () => {
  // Clear localStorage and cookies before each test
  await global.page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  await global.page.deleteCookie(...(await global.page.cookies()))
})