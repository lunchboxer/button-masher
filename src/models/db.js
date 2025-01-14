import { Database } from 'bun:sqlite'
import { randomBytes } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const env = process.env.NODE_ENV

const __dirname = dirname(fileURLToPath(import.meta.url))

const dbPath = join(__dirname, `../../database/${env || 'development'}.db`)

export const db = new Database(dbPath, { strict: true })
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA foreign_keys = ON;')

export const generateId = (length = 16) => {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'
  const charactersLength = characters.length
  let result = ''
  const randomBytesArray = randomBytes(length)
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomBytesArray[i] % charactersLength)
  }
  return result
}
