import { combineReducers } from 'redux'

import auth from './auth'
import game from './game'
import universe from './universe'
import socket from './socket'

const reducers = combineReducers({
  auth,
  game,
  universe,
  socket
})

export default reducers
