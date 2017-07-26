import { combineReducers } from 'redux'

import user from './user'
import universe from './universe'
import socketio from './socketio'
import players from './players'

const reducers = combineReducers({
  user,
  universe,
  socketio,
  players
})

export default reducers
