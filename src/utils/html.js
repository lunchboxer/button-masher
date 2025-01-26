export const html = (strings, ...inserts) => {
  return strings
    .reduce((result, str, index) => {
      if (Array.isArray(inserts[index])) {
        return result + str + inserts[index].join('')
      }
      return result + str + (inserts[index] || '')
    }, '')
    .trim()
}
