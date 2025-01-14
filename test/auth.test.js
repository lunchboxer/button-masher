import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { createServer } from '../src/app.js'

// Helper function to start the server
const PORT = process.env.PORT || 3010
let server
function startServer() {
  server = createServer(PORT, 'localhost')
}

const loginEndpoint = `http://localhost:${PORT}/api/auth/login`
const logoutEndpoint = `http://localhost:${PORT}/api/auth/logout`

// Helper function to stop the server
function stopServer() {
  if (server) {
    server.stop()
  }
}

const authRegex = /auth=;/
const sessionRegex = /sessionId=;/
const authSetRegex = /auth=/

describe('Auth Endpoints', () => {
  beforeEach(() => {
    startServer() // Start the server before each test
  })

  afterEach(() => {
    stopServer() // Stop the server after each test
  })

  describe('POST /login', () => {
    it('should return 400 if username or password is missing', async () => {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.errors).toBeDefined()
    })

    it('should return 401 if credentials are invalid', async () => {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'invalid', password: 'invalid' }),
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.errors.all).toBe('Invalid credentials')
    })

    it('should return 200 and set auth cookie if credentials are valid', async () => {
      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'james', password: 'password' }),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)

      // Check if the auth cookie is set
      const authCookie = response.headers.get('set-cookie')
      expect(authCookie).toMatch(authSetRegex)
    })
  })

  describe('POST /logout', () => {
    it('should return 200 and clear auth and session cookies', async () => {
      // First, log in to get the auth cookie
      const loginResponse = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'james', password: 'password' }),
      })

      const authCookie = loginResponse.headers.get('set-cookie')

      // Now, log out
      const logoutResponse = await fetch(logoutEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: authCookie, // Include the auth cookie in the request
        },
      })

      expect(logoutResponse.status).toBe(200)
      const data = await logoutResponse.json()
      expect(data.success).toBe(true)

      // Check if the auth and session cookies are cleared
      const logoutCookies = logoutResponse.headers.get('set-cookie')
      expect(logoutCookies).toMatch(authRegex)
      expect(logoutCookies).toMatch(sessionRegex)
    })
  })
})
