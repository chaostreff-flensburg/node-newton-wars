const config = require('./config')

exports.randomInt = (min, max) => {
  return Math.ceil(Math.random() * (max - min) + min)
}

exports.Vector = function (x, y) {
  this.x = x
  this.y = y
}

exports.Planet = function () {
  const x = exports.randomInt(config.planets.maximalSize, config.xResolution - config.planets.maximalSize)
  const y = exports.randomInt(config.planets.maximalSize, config.yResolution - config.planets.maximalSize)
  const r = exports.randomInt(config.planets.minimalSize, config.planets.maximalSize)
  this.pos = new exports.Vector(x, y)
  this.r = r
  this.g = r * config.gravity
}

exports.User = function (username, token, socket) {
  const x = exports.randomInt(config.planets.maximalSize, config.xResolution - config.planets.maximalSize)
  const y = exports.randomInt(config.planets.maximalSize, config.yResolution - config.planets.maximalSize)
  this.username = username
  this.auth = { token, socket }
  this.score = { kills: 0, deaths: 0 }
  this.game = { energy: 20, velocity: 10, angle: 0 }
  this.pos = new exports.Vector(x, y)
  this.r = config.userSize
}

exports.getUser = (users, token) => {
  return users.filter((user) => user.auth.token === token)[0] || null
}
