import { sessionStore } from '../utils/session-store.js'

export function extendContext(context) {
  context.setErrors = errors => {
    sessionStore.flash(context.sessionId, 'errors', errors)
  }
  context.setAlert = (message, type = 'info') => {
    sessionStore.flash(context.sessionId, 'alert', { message, type })
  }
  context.getErrors = () => {
    return sessionStore.getFlash(context.sessionId, 'errors') || {}
  }
  context.getAlert = () => {
    return sessionStore.getFlash(context.sessionId, 'alert')
  }

  return context
}
