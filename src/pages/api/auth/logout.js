import { setCookie } from '$/utils/cookies.js'
import { sessionStore } from '$/utils/session-store.js'

export const POST = context => {
  const sessionId = context.sessionId
  if (sessionId) {
    sessionStore.delete(sessionId)
  }

  const killCookieOptions = {
    expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
  }
  setCookie(context, 'auth', '', killCookieOptions, true)
  setCookie(context, 'sessionId', '', killCookieOptions, true)

  return context.sendJson({
    success: true,
  })
}
