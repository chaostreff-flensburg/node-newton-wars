import { CONNECT_USER, DISCONNECT_USER, SET_USERNAME } from '../constants'
import cookie from 'react-cookies'

export function connect (token) {
  return {
    type: CONNECT_USER,
    token
  }
}

export function disconnect () {
  return {
    type: DISCONNECT_USER
  }
}

export function setUsername (username) {
  return {
    type: SET_USERNAME,
    username
  }
}

export function connectUser () {
  return (dispatch, getState) => {
    const state = getState()
    const { username } = state.auth
    /*
    client.post(CONNECT_ENDPOINT, {
      username
    }).then((response) => {
      const { token } = response.data
      cookie.save('auth', { username, token })
      dispatch(connect(token))
    }).catch((error) => {
      console.log(error) // improve error handling
    })
    */
  }
}

export function disconnectUser () {
  return (dispatch, getState) => {
    const state = getState()
    const { token } = state.auth
    /*
    client.post(DISCONNECT_ENDPOINT, {
      token
    }).then((response) => {
      cookie.remove('auth')
      dispatch(disconnect())
    }).catch((error) => {
      console.log(error) // improve error handling
    })
    */
  }
}
