const TransferWebpackPlugin = require('transfer-webpack-plugin')
const winston = require('winston')
const open = require('open')
const webpack = require('webpack')
const Server = require('webpack-dev-server')
const utils = require('./utils')
const env = require('./env')

winston.cli()

const config = {
  entry: [
    `webpack-dev-server/client?http://${env.DEV_HOST}:${env.DEV_PORT}/`,
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    env.ENTRYPOINT
  ],
  output: {
    path: env.BUILD_PATH,
    publicPath: '/',
    filename: 'app.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new TransferWebpackPlugin([
      {
        from: 'static'
      }
    ], env.SOURCE_PATH)
  ],
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loaders: ['babel-loader'],
        exclude: [env.NODE_MODULES_PATH]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
        loader: 'file?name=fonts/[hash].[ext]'
      },
      {
        test: /\.(png|jpeg|jpg)([\?]?.*)$/,
        loader: 'file?name=static/[name].[ext]'
      }
    ]
  }
}

let ready = false
let faulty = false
let compiler = webpack(config);

winston.info('Running initial build ...')

let instance = new Server(compiler, {
  historyApiFallback: true,
  inline: true,
  hot: true,
  quiet: true,
  publicPath: '/'
})

compiler.watch({
    aggregateTimeout: 300,
    poll: true
}, (err, stats) => {
  if (err) {
    winston.error(err)
  } else {
    let info = stats.toJson({
      hash: true,
      timings: true,
      chunks: true
    })
    let size = 0
    info.chunks.forEach((chunk) => {
      size += chunk.size
    })
    let human = utils.getHumanFilesize(size)
    faulty = info.errors.length > 0 || info.warnings.length
    if (!ready && !faulty) {
      ready = true
      winston.info(`Starting development server: http://${env.DEV_HOST}:${env.DEV_PORT}`)
      instance.listen(env.DEV_PORT, env.DEV_HOST, () => {
        open(`http://${env.DEV_HOST}:${env.DEV_PORT}`)
      })
    }
    winston.info(`Build finished [${info.hash}] [${info.time}ms] [${utils.round(human.number, 2)}${human.unit}]`)
    if (faulty) {
      winston.warn('Faulty build: Listing errors and warnings ...')
      info.errors.forEach((error) => {
        winston.error(error)
      })
      info.warnings.forEach((warning) => {
        winston.warn(warning)
      })
    }
  }
})
