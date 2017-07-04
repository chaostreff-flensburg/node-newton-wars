import { SET_VELOCITY, SET_ENERGY, SET_ANGLE, REFRESH_GAME } from '../constants'

const game = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_ENERGY:
      return Object.assign({}, state, {
        energy: action.energy
      })
    case SET_VELOCITY:
      if (action.velocity < 1) {
        return state
      }
      return Object.assign({}, state, {
        velocity: action.velocity
      })
    case SET_ANGLE:
      if (action.angle > 180 || action.angle < -180) {
        action.angle = 180 - action.angle % 180
      }
      return Object.assign({}, state, {
        angle: action.angle
      })
    case REFRESH_GAME:
      return Object.assign({}, state, {
        energy: action.energy,
        velocity: action.velocity,
        angle: action.angle
      })
    default:
      return state
  }
}

export default game
