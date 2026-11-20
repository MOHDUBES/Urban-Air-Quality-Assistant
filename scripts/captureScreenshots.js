// scripts/captureScreenshots.js
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../docs/screenshots')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const PORT = 3001
const DEBUG_PORT = 9225

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl)
    this.id = 0
    this.pending = new Map()

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id)
        this.pending.delete(data.id)
        if (data.error) {
          reject(new Error(data.error.message))
        } else {
          resolve(data.result)
        }
      }
    }
  }

  async ready() {
    if (this.ws.readyState === WebSocket.OPEN) return
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve()
      this.ws.onerror = (err) => reject(err)
    })
  }

  async send(method, params = {}) {
    await this.ready()
    const id = ++this.id
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    return res?.result?.value
  }

  async setViewport(width, height, isMobile = false) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile,
    })
  }

  async screenshot(filePath) {
    const params = { format: 'webp', quality: 88 }
    const res = await this.send('Page.captureScreenshot', params)
    const buffer = Buffer.from(res.data, 'base64')
    fs.writeFileSync(filePath, buffer)
    console.log(`Saved screenshot: ${path.basename(filePath)} (${(buffer.length / 1024).toFixed(1)} KB)`)
  }

  close() {
    this.ws.close()
  }
}

async function run() {
  console.log('[capture] Starting server...')
  const server = spawn('node', ['server/index.js'], {
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'development' },
    cwd: path.join(__dirname, '..'),
    stdio: 'ignore',
  })

  await sleep(1500)

  console.log('[capture] Launching headless Chrome...')
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1280,900',
      `http://localhost:${PORT}`,
    ],
    { stdio: 'ignore' }
  )

  await sleep(2500)

  try {
    const listRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)
    const list = await listRes.json()
    const pageTab = list.find((t) => t.type === 'page')

    if (!pageTab) {
      throw new Error('No page tab found in Chrome targets: ' + JSON.stringify(list))
    }

    console.log('[capture] Connected to Chrome page target:', pageTab.id)
    const cdp = new CdpClient(pageTab.webSocketDebuggerUrl)
    await cdp.send('Page.enable')
    await cdp.send('Runtime.enable')

    await sleep(2000)

    // 1. Hero + Profile (Desktop Dark)
    console.log('[capture] Capturing Hero & Profile...')
    await cdp.setViewport(1280, 850)
    await cdp.screenshot(path.join(outDir, '01-hero-profile-dark.webp'))

    // Click sample profile to populate form & generate plan
    console.log('[capture] Submitting preset profile...')
    await cdp.eval(`
      const preset = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Asthma Patient'));
      if (preset) preset.click();
      setTimeout(() => {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      }, 300);
    `)

    // Wait for plan generation
    await sleep(5500)

    // 2. Dashboard AQI + Chart
    console.log('[capture] Capturing Dashboard...')
    await cdp.screenshot(path.join(outDir, '02-dashboard-dark.webp'))

    // 3. Scroll to Action Plan
    console.log('[capture] Capturing Action Plan...')
    await cdp.eval(`
      const el = document.getElementById('panel-plan');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `)
    await sleep(600)
    await cdp.screenshot(path.join(outDir, '03-action-plan-dark.webp'))

    // 4. Switch to What-If Tab
    console.log('[capture] Switching to What-If simulator...')
    await cdp.eval(`
      const tab = document.getElementById('tab-whatif');
      if (tab) tab.click();
      setTimeout(() => {
        const calcBtn = document.querySelector('#panel-whatif button[type="submit"]');
        if (calcBtn) calcBtn.click();
      }, 300);
    `)
    await sleep(4000)
    await cdp.screenshot(path.join(outDir, '04-whatif-simulator-dark.webp'))

    // 5. Switch to Chat Tab
    console.log('[capture] Switching to Chat assistant...')
    await cdp.eval(`
      const tab = document.getElementById('tab-chat');
      if (tab) tab.click();
      setTimeout(() => {
        const firstChip = Array.from(document.querySelectorAll('#panel-chat button')).find(b => b.textContent.includes('safe'));
        if (firstChip) firstChip.click();
      }, 300);
    `)
    await sleep(4000)
    await cdp.screenshot(path.join(outDir, '05-chat-assistant-dark.webp'))

    // 6. Switch to Light Mode Dashboard
    console.log('[capture] Capturing light mode...')
    await cdp.eval(`
      const lightBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label')?.includes('Light') || b.textContent.includes('Light'));
      if (lightBtn) lightBtn.click();
      const planTab = document.getElementById('tab-plan');
      if (planTab) planTab.click();
      window.scrollTo(0, 0);
    `)
    await sleep(1000)
    await cdp.screenshot(path.join(outDir, '06-dashboard-light.webp'))

    // 7. High-Contrast Mode
    console.log('[capture] Capturing high contrast mode...')
    await cdp.eval(`
      const hcBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label')?.includes('High Contrast') || b.textContent.includes('Contrast'));
      if (hcBtn) hcBtn.click();
    `)
    await sleep(1000)
    await cdp.screenshot(path.join(outDir, '07-dashboard-high-contrast.webp'))

    // 8. Mobile Viewport 360px
    console.log('[capture] Capturing mobile view...')
    await cdp.eval(`
      const darkBtn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label')?.includes('Dark') || b.textContent.includes('Dark'));
      if (darkBtn) darkBtn.click();
    `)
    await cdp.setViewport(360, 780, true)
    await sleep(1000)
    await cdp.screenshot(path.join(outDir, '08-mobile-view-360px.webp'))

    cdp.close()
    console.log('[capture] All screenshots captured successfully!')
  } catch (err) {
    console.error('[capture] Error capturing screenshots:', err)
  } finally {
    chrome.kill()
    server.kill()
  }
}

run()
