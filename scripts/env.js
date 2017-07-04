const path = require('path')

// host and port for the webpack development server
exports.DEV_HOST = '127.0.0.1'
exports.DEV_PORT = 8080

// host and port for the express production server
exports.PROD_HOST = '0.0.0.0'
exports.PROD_PORT = 80

// enable or disable analytics
exports.ANALYTICS = true

// the interval between the report logs of the analytics
exports.ANALYTICS_UPDATE_INTERVAL = 5000

// number of responses to be cached for the analytics
exports.ANALYTICS_RESPONSETIME_CACHE_SIZE = 10000

// project directory constants
exports.NODE_MODULES_PATH = path.resolve(__dirname, '..', 'node_modules')
exports.SOURCE_PATH = path.resolve(__dirname, '..', 'client')
exports.BUILD_PATH = path.resolve(__dirname, '..', 'public')
exports.CONTEXT_PATH = path.resolve(__dirname, '..')
exports.STATIC_PATH = path.resolve(exports.SOURCE_PATH, 'static')
exports.ENTRYPOINT = path.resolve(exports.SOURCE_PATH, 'index.js')
