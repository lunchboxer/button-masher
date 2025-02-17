import { generateId } from '../models/db.js'

export class SessionStore {
  constructor() {
    this.store = new Map()
  }

  create() {
    const sessionId = generateId()
    this.store.set(sessionId, { createdAt: Date.now() })
    return sessionId
  }

  get(sessionId) {
    return this.store.get(sessionId)
  }

  set(sessionId, data) {
    this.store.set(sessionId, data)
  }

  delete(sessionId) {
    this.store.delete(sessionId)
  }

  list() {
    return Array.from(this.store.entries())
  }

  flash(sessionId, key, value) {
    const sessionData = this.store.get(sessionId) || {}
    sessionData[key] = value
    this.store.set(sessionId, sessionData)
  }

  getFlash(sessionId, key) {
    const sessionData = this.store.get(sessionId)
    if (sessionData && sessionData[key] !== undefined) {
      const value = sessionData[key]
      delete sessionData[key] // Clear the flash data
      this.store.set(sessionId, sessionData) // Update the session
      return value
    }
    return null
  }
}

// Singleton instance of the session store
export const sessionStore = new SessionStore()
