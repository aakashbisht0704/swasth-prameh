#!/usr/bin/env node

/**
 * Simple GitHub Webhook Server for Auto-Deployment
 * 
 * This server listens for GitHub webhook events and triggers deployment
 * 
 * Usage:
 * 1. Install: npm install express body-parser
 * 2. Run: node webhook-server.js
 * 3. Configure GitHub webhook to point to: http://your-server:9000/webhook
 * 4. Set WEBHOOK_SECRET in environment or .env file
 */

const http = require('http')
const { exec } = require('child_process')
const crypto = require('crypto')
const path = require('path')

const PORT = process.env.WEBHOOK_PORT || 9000
const SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key-change-this'
const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.sh')

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = ''
    
    req.on('data', chunk => {
      body += chunk.toString()
    })
    
    req.on('end', () => {
      // Verify webhook signature (optional but recommended)
      const signature = req.headers['x-hub-signature-256']
      if (signature) {
        const hmac = crypto.createHmac('sha256', SECRET)
        const digest = 'sha256=' + hmac.update(body).digest('hex')
        if (signature !== digest) {
          console.error('❌ Invalid signature')
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Invalid signature' }))
          return
        }
      }
      
      try {
        const payload = JSON.parse(body)
        
        // Only deploy on push to main branch
        if (payload.ref === 'refs/heads/main' && payload.commits) {
          console.log(`📦 Deployment triggered by: ${payload.head_commit?.author?.name || 'Unknown'}`)
          console.log(`📝 Commit message: ${payload.head_commit?.message || 'N/A'}`)
          
          // Run deployment script
          exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Deployment error: ${error.message}`)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ 
                error: 'Deployment failed',
                message: error.message,
                stderr 
              }))
              return
            }
            
            console.log('✅ Deployment completed')
            console.log(stdout)
            
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Deployment triggered',
              output: stdout 
            }))
          })
        } else {
          // Not a push to main, just acknowledge
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Webhook received, but not a push to main branch' }))
        }
      } catch (error) {
        console.error('❌ Error parsing payload:', error)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid payload' }))
      }
    })
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`🚀 Webhook server listening on port ${PORT}`)
  console.log(`📡 Configure GitHub webhook: http://your-server:${PORT}/webhook`)
  console.log(`🔐 Secret: ${SECRET}`)
})


