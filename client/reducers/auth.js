import { SET_USERNAME, CONNECT_USER, DISCONNECT_USER } from '../constants'

const auth = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USERNAME:
      return Object.assign({}, state, {
        username: action.username
      })
    case CONNECT_USER:
      return Object.assign({}, state, {
        token: action.token
      })
    case DISCONNECT_USER:
      return Object.assign({}, state, {
        token: null
      })
    default:
      return state
  }
}

export default auth
