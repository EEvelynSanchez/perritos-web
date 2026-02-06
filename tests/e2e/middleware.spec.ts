import { test, expect } from '@playwright/test'

// Ensure the app is running locally at PLAYWRIGHT_BASE_URL (defaults to http://localhost:3000)

test.describe('Auth middleware', () => {
  test('redirects unauthenticated user from /dogs to /login with callbackUrl', async ({ page, baseURL }) => {
    await page.goto('/dogs')

    // Expect to be redirected to login
    await expect(page).toHaveURL(new RegExp('/login'))

    // Expect callbackUrl param contains /dogs
    const url = new URL(page.url())
    expect(url.searchParams.get('callbackUrl')).toBe('/dogs')
  })

  test('login page announces redirect reason for screen readers', async ({ page }) => {
    // Navigate to login with a callbackUrl
    await page.goto('/login?callbackUrl=/dogs')

    // The announcement should be present and visible to assistive tech
    const alert = page.getByRole('status')
    await expect(alert).toHaveText(/You must sign in to view/i)
  })
})
