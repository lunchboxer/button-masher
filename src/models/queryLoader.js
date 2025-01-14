import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const __dirname = new URL('.', import.meta.url).pathname
const nameRegex = /^--\s*name:\s*(\w+)/

function parseQueryFile(filePath) {
  const queries = {}
  const content = readFileSync(filePath, 'utf8')

  const lines = content.split('\n')
  let currentQueryName = null
  let currentQuery = []

  for (let line of lines) {
    line = line.trim()

    const nameMatch = line.match(nameRegex)

    if (nameMatch) {
      if (currentQueryName) {
        queries[currentQueryName] = currentQuery.join('\n').trim()
        currentQuery = []
      }
      currentQueryName = nameMatch[1]
    } else if (currentQueryName && line !== '') {
      currentQuery.push(line)
    }
  }

  if (currentQueryName && currentQuery.length > 0) {
    queries[currentQueryName] = currentQuery.join('\n').trim()
  }

  // Throw an error if no queries were found
  if (Object.keys(queries).length === 0) {
    throw new Error(`No queries found in file: ${filePath}`)
  }

  return queries
}

// Create a Proxy to handle missing queries
function createQueryProxy(queries) {
  return new Proxy(queries, {
    get(target, prop) {
      if (prop in target) {
        return target[prop] // Return the query if it exists
      }
      throw new Error(`Query not found: ${prop}`) // Throw an error if the query is missing
    },
  })
}

// Parse the queries.sql file
const rawQueries = parseQueryFile(join(__dirname, 'queries.sql'))

// Wrap the queries object in a Proxy
export const queries = createQueryProxy(rawQueries)
