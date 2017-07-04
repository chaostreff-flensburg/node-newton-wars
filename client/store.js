import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import cookie from 'react-cookies'

import reducers from './reducers'


const initialState = {
  auth: {
    username: '',
    token: null,
    kills: 0,
    deaths: 0,
    energy: 20,
    velocity: 10,
    angle: 0,
    entitity: {
      pos: {
        x: 0,
        y: 0
      },
      r: 0
    }
  },
  universe: {
    planets: [],
    dimensions: {
      x: 0,
      y: 0
    }
  },
  socket: {
    connected: false,
    notification: false
  }
}

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunkMiddleware)
)

export default store
