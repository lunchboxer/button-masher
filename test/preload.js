import { spawnSync } from 'node:child_process'
import { readSync } from 'node:fs'
import { join } from 'node:path'
import { exit } from 'node:process'
import { seed } from '../database/seed.js'

// Resolve the absolute path to the database file
const dbPath = join(__dirname, '../database/test.db')

// Check if the database file exists
const file = Bun.file(dbPath)
if (await file.exists()) {
  console.info('Preload check passed: Database file exists at', dbPath)
} else {
  console.error(
    'Error: The database file was not found at the expected location:',
    dbPath,
  )
  console.error('Would you like to create the database file now? (yes/no)')

  // Read user input from stdin
  const response = prompt()

  if (response?.toLowerCase() === 'yes') {
    console.info('Creating the database file...')

    // Run the `migrate` script from package.json
    const result = spawnSync('bun', ['run', 'migrate'], {
      stdio: 'inherit', // Forward output to the terminal
    })

    if (result.status !== 0) {
      console.error('Failed to create the database file. Exiting.')
      exit(1)
    }

    console.info('Database file created successfully.')
  } else {
    console.info('Exiting. The database file is required to run tests.')
    exit(1)
  }
}

await seed()

// Helper function to prompt user input
function prompt() {
  const buffer = Buffer.alloc(1024)
  const length = readSync(0, buffer, 0, 1024) // Read from stdin
  return buffer.toString('utf-8', 0, length).trim()
}
