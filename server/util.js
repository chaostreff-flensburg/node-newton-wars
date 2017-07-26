const config = require('./config')

if (config.updateFrequency < 20 || config.updateFrequency > 200) {
  throw new Error('Update frequency must be between 20Hz and 200Hz.')
}

const delta = 1000 / config.updateFrequency

exports.randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min)
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
  this.shots = []
  this.pos = new exports.Vector(x, y)
  this.r = config.userSize
}

exports.Shot = function () {
  this.points = []
  this.collided = false
  this.velocity =
  this.move = function (planets) {
    // move projectile depending on gravity
  }
}

exports.collide = (a, b) => {
  let clearance = 0
  if (a instanceof exports.User && b instanceof exports.User) {
    clearance += config.clearance.users
  } else if (a instanceof exports.Planet && b instanceof exports.Planet) {
    clearance += config.clearance.planets
  } else {
    clearance += config.clearance.common
  }
  const x = a.pos.x - b.pos.x
  const y = a.pos.y - b.pos.y
  return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < (a.r + b.r + clearance))
}

exports.getPublicUser = (user) => {
  let publicUser = Object.assign({}, user)
  delete publicUser.game
  delete publicUser.auth.token
  return publicUser
}
