const config = require('./config')
const math = require('./math')

const Vector = math.Vector
const randomInt = math.randomInt
const interval = 1000 / config.updateFrequency

exports.Planet = function () {
  const x = randomInt(config.planets.maximalSize, config.resolution.x - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.resolution.y - config.planets.maximalSize)
  const r = randomInt(config.planets.minimalSize, config.planets.maximalSize)
  this.pos = new Vector(x, y)
  this.r = r
  this.m = config.massFactor * r
}

exports.User = function (username, token, socket) {
  const x = randomInt(config.planets.maximalSize, config.resolution.x - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.resolution.y - config.planets.maximalSize)
  this.username = username
  this.auth = { token, socket }
  this.score = { kills: 0, deaths: 0 }
  this.game = { energy: 20, velocity: 10, angle: 0 }
  this.rockets = []
  this.pos = new Vector(x, y)
  this.r = config.sizes.users
}

exports.Rocket = function (position, velocity, angle) {
  this.collided = false
  this.r = config.sizes.rockets
  this.positions = [position]
  this.velocity = new Vector().fromPolar(velocity, angle)
  this.acceleration = false
  this.calculateGravity = function (planets) {
    this.acceleration = new Vector()
    planets.forEach((planet) => {
      const connection = planet.pos.clone().minus(this.positions[this.positions.length - 1])
      const distance = connection.size()
      const direction = connection.clone().unit()
      const gravity = direction.clone().times(config.gravity * planet.m).over(Math.pow(distance, 2))
      this.acceleration.plus(gravity)
    })
  }
  this.calculateVelocity = function () {
    if (this.acceleration) {
      const delta = this.acceleration.clone().times(interval)
      this.velocity.plus(delta)
    }
  }
  this.calculatePosition = function () {
    const position = new Vector()
    position.plus(this.positions[this.positions.length - 1])
    position.plus(this.velocity.clone().times(interval))
    position.plus(this.acceleration.clone().times(Math.pow(interval, 2)))
    this.positions.push(position)
  }
  this.move = function (planets) {
    if (this.collided) return
    this.calculateVelocity()
    this.calculateGravity(planets)
    this.calculatePosition()
  }
  this.pos = function () {
    return this.positions[this.positions.length - 1]
  }
}
