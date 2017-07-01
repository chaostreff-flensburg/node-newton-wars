import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import cookie from 'react-cookies'

import reducers from './reducers'


const initialState = {
  game:  {
    energy: 20,
    velocity: 10,
    angle: 0
  },
  auth: cookie.load('auth') || {
    token: null,
    username: null
  },
  universe: {
    planets: [],
    dimensions: {
      x: 0,
      y: 0
    }
  }
}

const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunkMiddleware)
)

export default store
