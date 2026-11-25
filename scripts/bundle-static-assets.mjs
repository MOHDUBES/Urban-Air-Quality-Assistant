// scripts/bundle-static-assets.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const outputFile = path.resolve(rootDir, 'server/services/staticAssets.js')

function getMimeType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8'
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8'
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8'
  if (filePath.endsWith('.svg')) return 'image/svg+xml'
  if (filePath.endsWith('.png')) return 'image/png'
  if (filePath.endsWith('.ico')) return 'image/x-icon'
  if (filePath.endsWith('.json')) return 'application/json'
  if (filePath.endsWith('.webmanifest')) return 'application/manifest+json'
  return 'application/octet-stream'
}

function scanDir(dir, base = '') {
  const files = []
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name)
    const relPath = path.join(base, item.name).replace(/\\/g, '/')
    if (item.isDirectory()) {
      files.push(...scanDir(fullPath, relPath))
    } else {
      files.push({ fullPath, relPath: '/' + relPath })
    }
  }
  return files
}

if (!fs.existsSync(distDir)) {
  console.error('dist/ does not exist. Run npm run build first.')
  process.exit(1)
}

const allFiles = scanDir(distDir)
const assetsMap = {}

for (const { fullPath, relPath } of allFiles) {
  const mime = getMimeType(relPath)
  const isBinary = mime.startsWith('image/') && !relPath.endsWith('.svg')
  if (isBinary) {
    assetsMap[relPath] = {
      contentType: mime,
      isBase64: true,
      content: fs.readFileSync(fullPath).toString('base64'),
    }
  } else {
    assetsMap[relPath] = {
      contentType: mime,
      isBase64: false,
      content: fs.readFileSync(fullPath, 'utf8'),
    }
  }
}

const jsContent = `// Auto-generated embedded static assets for zero-dependency Vercel deployment
export const staticAssets = ${JSON.stringify(assetsMap)};
`

fs.writeFileSync(outputFile, jsContent, 'utf8')
console.log(`Bundled ${allFiles.length} static assets into ${outputFile}`)
