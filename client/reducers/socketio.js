import { AVAILABLE_SOCKET, UNAVAILABLE_SOCKET, HIDE_SOCKET_NOTIFICATION } from '../constants'

const socketio = (state = {}, action = {}) => {
  switch (action.type) {
    case AVAILABLE_SOCKET:
      return Object.assign({}, state, {
        connected: true,
        notification: true
      })
      break
    case UNAVAILABLE_SOCKET:
      return Object.assign({}, state, {
        connected: false,
        notification: true
      })
      break
    case HIDE_SOCKET_NOTIFICATION:
      return Object.assign({}, state, {
        notification: false
      })
      break
    default:
      return state
  }
}

export default socketio
