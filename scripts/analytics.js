const env = require('./env')

let analytics = {}

analytics.reporter = null

analytics.clear = () => {
  analytics.timings = []
  analytics.min = 0
  analytics.avg = 0
  analytics.max = 0
  analytics.index = 0
  analytics.logger = null
  analytics.cached = false
}

analytics.clear()

analytics.start = (logger) => {
  analytics.logger = logger
  analytics.reporter = setInterval(() => {
    let size
    let total
    if (!analytics.cached) {
      const samples = analytics.timings
      size = samples.length
      total = 0
      analytics.min = samples[0]
      samples.forEach((sample) => {
        if (sample < analytics.min) analytics.min = sample
        if (sample > analytics.max) analytics.max = sample
        total += sample
      })
      analytics.avg = (total / size)
      if (analytics.timings.length) {
        analytics.logger.info(`Analytics: ${analytics.min}ms ${Math.round(analytics.avg)}ms ${analytics.max}ms across ${size ? size : analytics.timings.length} requests`)
      } else {
        analytics.logger.warn(`Analytics: Waiting for requests`)
      }
    }
    analytics.cached = true
  }, env.ANALYTICS_UPDATE_INTERVAL)
}

analytics.update = (time) => {
  analytics.timings[analytics.index] = time
  ++analytics.index
  if (analytics.index === env.ANALYTICS_RESPONSETIME_CACHE_SIZE) {
    analytics.index = 0
  }
  analytics.cached = false
}

analytics.stop = () => {
  clearInterval(analytics.reporter)
  analytics.clear()
}

module.exports = analytics
