import { combineReducers } from 'redux'

import auth from './auth'
import game from './game'
import universe from './universe'

const reducers = combineReducers({
  auth,
  game,
  universe
})

export default reducers
