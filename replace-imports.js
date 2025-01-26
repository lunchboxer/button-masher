import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Define the directory to start searching from (e.g., 'src')
const rootDir = join(__dirname, 'src')

// Check if the root directory exists
if (!statSync(rootDir).isDirectory()) {
  console.error(`Directory not found: ${rootDir}`)
  process.exit(1)
}

// Define an array of directories to replace
const directories = ['utils', 'components', 'pages', 'models', 'middleware'] // Add more directories as needed

const extensionRegex = /\.(js|ts|jsx|tsx)$/

// Function to recursively process files in a directory
function processDirectory(directory) {
  console.info(`Processing directory: ${directory}`)

  const files = readdirSync(directory)

  for (const file of files) {
    const filePath = join(directory, file)

    try {
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(filePath)
      } else if (stat.isFile() && extensionRegex.test(file)) {
        // Process JavaScript or TypeScript files
        console.info(`Processing file: ${filePath}`)
        replaceImportsInFile(filePath)
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error)
    }
  }
}

// Function to replace import paths in a file
function replaceImportsInFile(filePath) {
  let content = readFileSync(filePath, 'utf8')
  let hasChanges = false

  // Apply replacements for each directory
  for (const dir of directories) {
    // Regex to match import statements for the current directory
    const importRegex = new RegExp(
      `(import\\s+.+\\s+from\\s+['"])(\\.\\.\\/[^'"]*?\\/${dir}\\/)([^'"]*['"].*)`,
      'g',
    )

    // Replace import paths using regex
    content = content.replace(importRegex, (_match, p1, _p2, p3) => {
      hasChanges = true
      // Replace the path with '$/dir/'
      return `${p1}$/${dir}/${p3}`
    })
  }

  // Write the updated content back to the file if changes were made
  if (hasChanges) {
    writeFileSync(filePath, content, 'utf8')
    console.info(`Updated imports in: ${filePath}`)
  }
}

// Start processing from the root directory
processDirectory(rootDir)

console.info('Import replacement complete!')
