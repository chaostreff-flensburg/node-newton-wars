import { LOAD_PLAYERS, ADD_PLAYER, REMOVE_PLAYER } from '../constants'

const players = (state = [], action = {}) => {
  switch (action.type) {
    case LOAD_PLAYERS:
      return [].concat(action.players)
    case ADD_PLAYER:
      return [].concat(state).concat({
        username: action.username,
        auth: action.auth,
        score: action.score,
        pos: action.pos,
        r: action.r
      })
    case REMOVE_PLAYER:
      return [].concat(state).filter((player) => {
        return player.auth.socket !== action.socket
      })
    default:
      return state
  }
}

export default players
