export function sendJsonMiddleware(context) {
  context.sendJson = (data, options = {}) => {
    const headers = new Headers(context.headers)
    headers.set('content-type', 'application/json')
    const jsonData = JSON.stringify(data)
    return new Response(jsonData, { status: 200, headers, ...options })
  }
  return context
}
