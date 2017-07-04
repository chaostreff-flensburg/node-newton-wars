import { SET_USERNAME, LOGIN_USER } from '../constants'

const auth = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USERNAME:
      return Object.assign({}, state, {
        username: action.username
      })
    case LOGIN_USER:
      return Object.assign({}, state, {
        username: action.username,
        token: action.token,
        kills: action.kills,
        deaths: action.deaths,
        energy: action.energy,
        velocity: action.velocity,
        angle: action.angle,
        entitity: action.entitity
      })
    default:
      return state
  }
}

export default auth
