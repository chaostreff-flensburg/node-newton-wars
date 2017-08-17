const config = require('./config')
const math = require('./math')
const entities = require('./entities')

const Vector = math.Vector
const Planet = entities.Planet
const User = entities.User
const Rocket = entities.Rocket

exports.collide = (a, b) => {
  let clearance = 0
  if (a instanceof User && b instanceof User) {
    clearance += config.clearance.users
  } else if (a instanceof Planet && b instanceof Planet) {
    clearance += config.clearance.planets
  } else if (a instanceof Rocket || b instanceof Rocket) {
    clearance = 0
  } else {
    clearance += config.clearance.common
  }
  return b.pos.clone().minus(a.pos).size() < a.r + b.r + clearance
}

exports.getPublicUser = (user) => {
  const publicUser = Object.assign({}, user)
  delete publicUser.game
  delete publicUser.auth.token
  return publicUser
}
