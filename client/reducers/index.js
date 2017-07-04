import { combineReducers } from 'redux'

import auth from './auth'
import universe from './universe'
import socket from './socket'

const reducers = combineReducers({
  auth,
  universe,
  socket
})

export default reducers
