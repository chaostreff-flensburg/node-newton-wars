const TransferWebpackPlugin = require('transfer-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const winston = require('winston')
const fs = require('fs-extra')
const utils = require('./utils')
const env = require('./env')

winston.cli()

const config = {
  entry: env.ENTRYPOINT,
  output: {
    path: env.BUILD_PATH,
    filename: 'app.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
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

winston.info('Running production build...')

const compiler = webpack(config);

winston.info(`Purging build folder: ${path.relative(env.CONTEXT_PATH, env.BUILD_PATH)}`)

fs.emptyDir(env.BUILD_PATH, (err) => {
  if (err) winston.error(err)
  compiler.run((err, stats) => {
    if (err) {
      winston.error(err)
    } else {
      let info = stats.toJson()
      let size = 0
      info.chunks.forEach((chunk) => {
        size += chunk.size
      })
      let human = utils.getHumanFilesize(size)
      winston.info(`Build finished [${info.hash}] [${info.time}ms] [${utils.round(human.number, 2)}${human.unit}]`)
    }
  })
})
