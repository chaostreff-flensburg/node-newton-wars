const express = require('express')
const winston = require('winston')
const path = require('path')
const mcache = require('memory-cache')
const env = require('./env')
const analytics = require('./analytics')

let server = express()

winston.cli()
if (env.ANALYTICS) {
  analytics.start(winston)
}

const cache = (duration) => {
  return (req, res, next) => {
    let key = `__express__${req.originalUrl || req.url}`
    let content = mcache.get(key)
    if (content) {
      res.send(content)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

server.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    winston.info(`${res.statusCode} ${req.method} ${duration}ms ${req.url}`)
    if (env.ANALYTICS) analytics.update(duration)
  })
  next()
})

server.use(cache(60), express.static(path.relative(env.CONTEXT_PATH, env.BUILD_PATH)))

server.use(cache(60), (req, res) => {
  res.sendFile('index.html', {
    root: env.BUILD_PATH
  })
})

server.listen(env.PROD_PORT, env.PROD_HOST, () => {
  winston.info(`Starting production server: http://${env.PROD_HOST}:${env.PROD_PORT}`)
})
