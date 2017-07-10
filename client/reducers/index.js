import { combineReducers } from 'redux'

import user from './user'
import universe from './universe'
import socketio from './socketio'

const reducers = combineReducers({
  user,
  universe,
  socketio
})

export default reducers
