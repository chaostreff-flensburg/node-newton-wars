import { CONNECT_SOCKET, DISCONNECT_SOCKET, HIDE_SOCKET_NOTIFICATION } from '../constants'

const socket = (state = {}, action = {}) => {
  switch (action.type) {
    case CONNECT_SOCKET:
      return Object.assign({}, state, {
        connected: true,
        notification: true
      })
      break
    case DISCONNECT_SOCKET:
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

export default socket
