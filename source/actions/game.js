import client from '../axios'

import { SHOOT_ENDPOINT } from '../endpoints'
import { REFRESH_GAME, SET_ENERGY, SET_VELOCITY, SET_ANGLE } from '../constants'

export function refreshGame (energy, velocity, angle) {
  return {
    type: REFRESH_GAME,
    energy,
    velocity,
    angle
  }
}

export function setEnergy (energy) {
  return {
    type: SET_ENERGY,
    energy
  }
}

export function setVelocity (velocity) {
  return {
    type: SET_VELOCITY,
    velocity
  }
}

export function setAngle (angle) {
  return {
    type: SET_ANGLE,
    angle
  }
}

export function shoot () {
  return (dispatch, getState) => {
    const state = getState()
    const { token } = state.auth
    const { velocity, angle } = state.game
    client.post(SHOOT_ENDPOINT, {
      token,
      velocity,
      angle
    }).then((response) => {
      const { energy, velocity } = response.data
      dispatch(refreshGame(energy, velocity, angle))
    }).catch((error) => {
      console.log(error) // improve error handling
    })
  }
}
