import { SET_USERNAME, LOGIN_USER } from '../constants'

export function setUsername (username) {
  return {
    type: SET_USERNAME,
    username
  }
}

export function loginUser (data) {
  const { username, token, kills, deaths, energy, velocity, angle, entitity } = data
  return {
    type: LOGIN_USER,
    username,
    token,
    kills,
    deaths,
    energy,
    velocity,
    angle,
    entitity
  }
}
