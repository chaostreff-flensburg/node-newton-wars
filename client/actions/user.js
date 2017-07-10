import { SET_USERNAME, LOGIN, INVALIDATE_LOGIN, LOGOUT, NOTIFY_LOGOUT, LOAD_USER } from '../constants'

export function setUsername (username) {
  return {
    type: SET_USERNAME,
    username
  }
}

export function login (username) {
  return {
    type: LOGIN,
    username
  }
}

export function invalidateLogin (error) {
  return {
    type: INVALIDATE_LOGIN,
    error
  }
}

export function logout (username, token) {
  return {
    type: LOGOUT,
    username,
    token
  }
}

export function notifyLogout (message) {
  return {
    type: NOTIFY_LOGOUT,
    message
  }
}

export function loadUser (username, auth, score, game, pos, r) {
  return {
    type: LOAD_USER,
    username,
    auth,
    score,
    game,
    pos,
    r
  }
}
