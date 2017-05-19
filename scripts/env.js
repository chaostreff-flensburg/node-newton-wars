const path = require('path')

let env = {}

// host and port for the webpack development server
env.DEV_HOST = '127.0.0.1'
env.DEV_PORT = 8080

// host and port for the express production server
env.PROD_HOST = '0.0.0.0'
env.PROD_PORT = 80

// enable or disable analytics
env.ANALYTICS = true

// the interval between the report logs of the analytics
env.ANALYTICS_UPDATE_INTERVAL = 5000

// number of responses to be cached for the analytics
env.ANALYTICS_RESPONSETIME_CACHE_SIZE = 10000

// project directory constants
env.NODE_MODULES_PATH = path.resolve(__dirname, '..', 'node_modules')
env.SOURCE_PATH = path.resolve(__dirname, '..', 'source')
env.BUILD_PATH = path.resolve(__dirname, '..', 'build')
env.CONTEXT_PATH = path.resolve(__dirname, '..')
env.STATIC_PATH = path.resolve(__dirname, '..', 'source', 'static')
env.ENTRYPOINT = path.resolve(__dirname, '..', 'source/index.js')

module.exports = env
