export const sanitizeObject = input => {
  if (!input) {
    return input
  }
  if (typeof input !== 'object') {
    return {}
  }
  const sanitizedObject = {}
  for (const key of Object.keys(input)) {
    sanitizedObject[key] = sanitize(input[key])
  }
  return sanitizedObject
}

export const sanitize = unsafe => {
  if (typeof unsafe !== 'string') {
    return unsafe
  }
  return unsafe
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
