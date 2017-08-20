import io from 'socket.io-client'

import {
  CONNECT_SOCKET,
  DISCONNECT_SOCKET,
  REQUEST_UNIVERSE,
  REQUEST_PLAYERS,
  LOGIN,
  LOGOUT,
  SHOOT_ROCKET
} from './constants'
import {
  availableSocket,
  unavailableSocket,
  loadUniverse,
  loadUser,
  invalidateLogin,
  notifyLogout,
  addPlayer,
  removePlayer,
  loadPlayers
} from './actions'

let socket = null

const socketioMiddleware = store => next => action => {
  const state = store.getState()
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
      socket.on('send-players', (data) => {
        const { players } = data
        store.dispatch(loadPlayers(players))
      })
      socket.on('join', (data) => {
        const { username, auth, score, pos, r } = data
        store.dispatch(addPlayer(username, auth, score, pos, r))
      })
      socket.on('leave', (data) => {
        const { socket } = data
        store.dispatch(removePlayer(socket))
      })
      socket.on('authorized', (data) => {
        const { username, auth, score, game, pos, r } = data
        store.dispatch(loadUser(username, auth, score, game, pos, r))
      })
      socket.on('unauthorized', (data) => {
        const { error, message, sync } = data
        if (error) store.dispatch(invalidateLogin(error))
        if (message || sync) store.dispatch(notifyLogout(message))
      })
      break
    case DISCONNECT_SOCKET:
      socket.disconnect()
      break
    case REQUEST_UNIVERSE:
      socket.emit('request-universe')
      break
    case REQUEST_PLAYERS:
      socket.emit('request-players')
      break
    case LOGIN:
      socket.emit('login', { username: action.username })
      break
    case LOGOUT:
      socket.emit('logout', { username: action.username, token: action.token })
      break
    case SHOOT_ROCKET:
      socket.emit('shoot', { username: state.user.username, token: state.user.auth.token, angle: action.angle, velocity: action.velocity })
      break
  }
  return next(action)
}

export default socketioMiddleware
