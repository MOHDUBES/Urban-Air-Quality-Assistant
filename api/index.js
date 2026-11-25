// api/index.js
// Vercel serverless handler forwarding API calls to the primary production API server.

export default function handler(req, res) {
  const backendUrl = `https://urban-air-quality-assistant-server-eosin.vercel.app${req.url || ''}`
  res.redirect(307, backendUrl)
}

