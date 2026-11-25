// scripts/bundle-static-assets.mjs
// Ensures staticAssets.js exports a valid asset dictionary without binary bloat.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outputFile = path.resolve(rootDir, 'server/services/staticAssets.js')

const jsContent = `// Auto-generated embedded static assets for zero-dependency runtime
export const staticAssets = {};
`

fs.writeFileSync(outputFile, jsContent, 'utf8')
console.log(`Updated ${outputFile} cleanly without binary bloat.`)
