export const redirect = (context, url, status = 302, params = {}) => {
  const headers = new Headers(context.headers)
  const queryString = new URLSearchParams(params).toString()
  const redirectUrl = queryString ? `${url}?${queryString}` : url
  headers.set('location', redirectUrl)

  return new Response(null, {
    headers,
    status,
  })
}
