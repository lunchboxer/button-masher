export const setCookie = (context, name, value, options, append = false) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  }
  const finalOptions = { ...defaultOptions, ...options }
  const optionsString = Object.entries(finalOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ')
  const cookieString = `; ${optionsString}`

  if (append) {
    context.headers.append('Set-Cookie', `${name}=${value}${cookieString}`)
  } else {
    context.headers.set('Set-Cookie', `${name}=${value}${cookieString}`)
  }
}
