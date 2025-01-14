import { Database } from 'bun:sqlite'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateId } from '../src/models/db.js'
import { hashPassword } from '../src/utils/crypto.js'

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url))

// Determine the database file path based on NODE_ENV
const dbPath = join(__dirname, `./${process.env.NODE_ENV || 'development'}.db`)
console.info('Database path:', dbPath)

// Initialize the database
const db = new Database(dbPath)

// Enable foreign key support
db.exec('PRAGMA foreign_keys = ON;')

// Helper function to check if a table exists
function tableExists(tableName) {
  const checkTableQuery = `
    SELECT name FROM sqlite_master
    WHERE type='table' AND name=?;
  `
  const result = db.prepare(checkTableQuery).get(tableName)
  return !!result
}

// Helper function to execute the schema.sql file
function runSchema() {
  const schemaPath = join(__dirname, './schema.sql')
  const schemaSql = readFileSync(schemaPath, 'utf8')
  db.exec(schemaSql)
  console.info('Schema applied successfully.')
}

// Create a user
const createUser = async (username, password, email, name, role) => {
  const hashedPassword = await hashPassword(password)
  const id = generateId()

  const createStatement = db.prepare(`
    INSERT INTO user (id, username, name, email, password, role)
    VALUES (?, ?, ?, ?, ?, ?);
  `)
  const result = createStatement.run(
    id,
    username,
    name,
    email,
    hashedPassword,
    role,
  )
  console.info('User created:', result)
  return id
}

// Main seeding function
export const seed = async () => {
  // Check if the user table exists
  if (!tableExists('user')) {
    console.info('User table does not exist. Running schema...')
    runSchema()
  }

  // Check if users already exist
  const userCountQuery = db.prepare('SELECT COUNT(*) AS count FROM user;')
  const userCount = userCountQuery.get().count
  console.info('User count:', userCount)

  if (userCount > 0) {
    console.info('Users already seeded.')
    return
  }

  // Seed the admin user
  const userId = await createUser(
    'james',
    'password',
    'james@example.com',
    'James',
    'admin',
  )
  console.info('Admin user created:', userId)
}

// Run the seed script if executed directly
if (import.meta.main) {
  console.info('Seeding database...')
  await seed()
}
