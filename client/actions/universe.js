import { REQUEST_UNIVERSE, LOAD_UNIVERSE } from '../constants'

export function requestUniverse () {
  return {
    type: REQUEST_UNIVERSE
  }
}

export function loadUniverse (planets, dimensions) {
  return {
    type: LOAD_UNIVERSE,
    planets,
    dimensions
  }
}
