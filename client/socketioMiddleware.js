import io from 'socket.io-client'

import { CONNECT_SOCKET, DISCONNECT_SOCKET, REQUEST_UNIVERSE, LOGIN, LOGOUT } from './constants'
import { availableSocket, unavailableSocket, loadUniverse, loadUser, invalidateLogin } from './actions'

let socket = null

const socketioMiddleware = store => next => action => {
  switch (action.type) {
    case CONNECT_SOCKET:
      socket = io.connect('http://127.0.0.1:9000')
      socket.on('connect', () => {
        store.dispatch(availableSocket())
      })
      socket.on('disconnect', () => {
        store.dispatch(unavailableSocket())
      })
      socket.on('send-universe', (data) => {
        const { planets, dimensions } = data
        store.dispatch(loadUniverse(planets, dimensions))
      })
      socket.on('authorized', (data) => {
        const { username, auth, score, game, pos, r } = data
        store.dispatch(loadUser(username, auth, score, game, pos, r))
      })
      socket.on('unauthorized', (data) => {
        const { error, message } = data
        if (error) store.dispatch(invalidateLogin(error))
        if (message) store.dispatch(notifyLogout(message))
      })
      break
    case DISCONNECT_SOCKET:
      socket.disconnect()
      break
    case REQUEST_UNIVERSE:
      socket.emit('request-universe')
      break
    case LOGIN:
      socket.emit('login', { username: action.username })
      break
    case LOGOUT:
      socket.emit('logout', { username: action.username, token: action.token })
      break
  }
  return next(action)
}

export default socketioMiddleware
