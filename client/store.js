import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import cookie from 'react-cookies'

import socketioMiddleware from './socketioMiddleware'
import reducers from './reducers'


const initialState = {
  user: {
    username: '',
    auth: {
      token: '',
      socket: ''
    },
    score: {
      kills: 0,
      deaths: 0
    },
    game: {
      energy: 20,
      velocity: 10,
      angle: 0
    },
    shots: [],
    pos: {
      x: 0,
      y: 0
    },
    r: 0,
    error: null,
    message: null,
    loading: false
  },
  universe: {
    planets: [],
    dimensions: {
      x: 0,
      y: 0
    }
  },
  socketio: {
    connected: false,
    notification: false
  },
  players: []
}

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunkMiddleware, socketioMiddleware)
)

export default store
