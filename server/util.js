const config = require('./config')
const math = require('./math')
const entities = require('./entities')

const Vector = math.Vector
const Planet = entities.Planet
const User = entities.User
const Rocket = entities.Rocket

// calculate if a collision occurs
exports.collide = (a, b) => {
  // additional distance besides the radii that should not be violated against
  let clearance = 0
  if (a instanceof User && b instanceof User) {
    // prevent users from spawning to close to each other
    clearance += config.clearance.users
  } else if (a instanceof Planet && b instanceof Planet) {
    // increase to achieve a more homogeneous universe
    // decrease to achieve a more heterogeneous universe
    clearance += config.clearance.planets
  } else if (a instanceof Rocket || b instanceof Rocket) {
    // rockets should only collide on direct contact
    clearance = 0
  } else {
    // common clearance when no special case applies
    clearance += config.clearance.common
  }
  // if the distance bigger than the radii and the clearance
  return b.pos.clone().minus(a.pos).longitude() < a.r + b.r + clearance
}

// remove private information from the user object before broadcasting it to everyone
exports.getPublicUser = (user) => {
  const publicUser = Object.assign({}, user)
  // unnecessary overhead
  delete publicUser.game
  // reinforce security and prevent session spoofing
  delete publicUser.auth.token
  return publicUser
}
