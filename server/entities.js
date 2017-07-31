const config = require('./config')
const math = require('./math')

const Vector = math.Vector
const randomInt = math.randomInt
const interval = 1000 / config.updateFrequency

// a planet which applies gravity to the rockets
exports.Planet = function () {
  // generate values that require randomness
  const x = randomInt(config.planets.maximalSize, config.resolution.x - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.resolution.y - config.planets.maximalSize)
  const r = randomInt(config.planets.minimalSize, config.planets.maximalSize)
  // store x and y coordinates as a vector
  this.pos = new Vector(x, y)
  // planet radius
  this.r = r
  // planet mass
  this.m = config.massFactor * r
}

// every user that chose a valid name
exports.User = function (username, token, socket) {
  // generate values that require randomness
  const x = randomInt(config.planets.maximalSize, config.resolution.x - config.planets.maximalSize)
  const y = randomInt(config.planets.maximalSize, config.resolution.y - config.planets.maximalSize)
  // a unique username
  this.username = username
  // auth properties for identification and authorisation
  this.auth = { token, socket }
  // current score
  this.score = { kills: 0, deaths: 0 }
  // game statistics
  this.game = { energy: 20, velocity: 10, angle: 0 }
  // active projectiles
  this.rockets = []
  // current position
  this.pos = new Vector(x, y)
  // size
  this.r = config.sizes.users
}

// the projectile that is fired by the users
exports.Rocket = function (position, velocity, angle) {
  // did the rocket collide
  this.collided = false
  // size of the rocket
  this.r = config.sizes.rockets
  // points the rocket passed
  this.positions = [position]
  // the current velocity vector of the rocket
  this.velocity = new Vector().fromPolar(velocity, angle)
  // the current acceleration from gravity
  this.acceleration = false
  // calculate gravitational acceleration from given planet
  this.calculateGravity = function (planets) {
    // clear acceleration
    this.acceleration = new Vector()
    // get contribution for every planet
    planets.forEach((planet) => {
      // the connection vector from the rocket and to the planet
      const connection = planet.pos.clone().minus(this.positions[this.positions.length - 1])
      // the scalar distance between the rocket and the planet
      const distance = connection.longitude()
      // the direction as unit vector towards the planet
      const direction = connection.clone().unit()
      // resulting from Newton's law of universal gravitation after applying Newton's second law: a = G * m / r ^ 2
      const gravity = direction.clone().times(config.gravity * planet.m).over(Math.pow(distance, 2))
      // add up contributions
      this.acceleration.plus(gravity)
    })
  }
  // calculate the velocity from the previous gravitational acceleration
  this.calculateVelocity = function () {
    // for every point but the first one
    if (this.acceleration) {
      // change in velocity
      const delta = this.acceleration.clone().times(interval)
      // apply the change to the velocity
      this.velocity.plus(delta)
    }
  }
  this.calculatePosition = function () {
    // the position will be a new vector
    const position = new Vector()
    // add previous position
    position.plus(this.positions[this.positions.length - 1])
    // add contribution of the velocity
    position.plus(this.velocity.clone().times(interval))
    // add contribution of the acceleration
    position.plus(this.acceleration.clone().times(Math.pow(interval, 2)))
    // add position to the traveled positions
    this.positions.push(position)
  }
  // calculate the next position of the projectile
  this.move = function (planets, users) {
    // the rocket will not be moved if it already collided
    if (this.collided) return
    // calculate velocity
    this.calculateVelocity()
    // calculate gravitational acceleration from every planet
    this.calculateGravity(planets)
    // calculate next position
    this.calculatePosition()
  }
  this.pos = function () {
    return this.positions[this.positions.length - 1]
  }
}
