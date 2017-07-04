import { LOAD_UNIVERSE } from '../constants'

const universe = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_UNIVERSE:
      return Object.assign({}, state, {
        planets: action.planets,
        dimensions: action.dimensions
      })
      break
    default:
      return state
  }
}

export default universe
