import { REQUEST_PLAYERS, LOAD_PLAYERS, ADD_PLAYER, REMOVE_PLAYER } from '../constants'

export function requestPlayers () {
  return {
    type: REQUEST_PLAYERS
  }
}

export function loadPlayers (players) {
  return {
    type: LOAD_PLAYERS,
    players
  }
}

export function addPlayer (username, auth, score, pos, r) {
  return {
    type: ADD_PLAYER,
    username,
    auth,
    score,
    pos,
    r
  }
}

export function removePlayer (socket) {
  return {
    type: REMOVE_PLAYER,
    socket
  }
}
