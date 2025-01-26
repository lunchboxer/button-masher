const dev = process.env.NODE_ENV !== 'production'

export function sendPageMiddleware(context) {
  context.sendPage = (pageFunction, data) => {
    const headers = new Headers(context.headers)
    headers.set('content-type', 'text/html')
    const alert = context.getAlert()
    const { user, nonce } = context
    // Individual errors from the data object take precedence over errors from the session
    const sessionErrors = context.getErrors()
    const dataErrors = data?.errors
    const errors = { ...sessionErrors, ...dataErrors }
    const templateData = { user, alert, dev, nonce, ...data, errors }
    if (typeof pageFunction !== 'function') {
      return new Response(pageFunction, { status: 200, headers })
    }
    const html = pageFunction(templateData)
    return new Response(html, { status: 200, headers })
  }
  return context
}
