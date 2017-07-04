import { LOAD_UNIVERSE } from '../constants'

export function loadUniverse (data) {
  const { planets, dimensions } = data
  return {
    type: LOAD_UNIVERSE,
    planets,
    dimensions
  }
}
