export function camelToSnake(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj // Return null or non-object values as-is
  }

  // Handle arrays (map each element recursively)
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item))
  }

  const snakeCaseObj = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        letter => `_${letter.toLowerCase()}`,
      )
      // Recursively convert nested objects
      snakeCaseObj[snakeKey] = camelToSnake(obj[key])
    }
  }
  return snakeCaseObj
}

export function snakeToCamel(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj // Return null or non-object values as-is
  }

  // Handle arrays (map each element recursively)
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item))
  }

  const camelCaseObj = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, letter =>
        letter[1].toUpperCase(),
      )
      // Recursively convert nested objects
      camelCaseObj[camelKey] = snakeToCamel(obj[key])
    }
  }
  return camelCaseObj
}
