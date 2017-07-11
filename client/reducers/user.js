import { SET_USERNAME, LOAD_USER, INVALIDATE_LOGIN, NOTIFY_LOGOUT, LOGIN, LOGOUT } from '../constants'

const auth = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_USER:
      return Object.assign({}, state, {
        token: action.auth.token,
        socket: action.auth.socket
      })
      break
    case NOTIFY_LOGOUT:
      return Object.assign({}, state, {
        token: '',
        socket: ''
      })
      break
    default:
      return state
  }
}

const score = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_USER:
      return Object.assign({}, state, {
        kills: action.score.kills,
        deaths: action.score.deaths
      })
      break
    case NOTIFY_LOGOUT:
      return Object.assign({}, state, {
        kills: 0,
        deaths: 0
      })
      break
    default:
      return state
  }
}

const game = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_USER:
      return Object.assign({}, state, {
        energy: action.game.energy,
        velocity: action.game.velocity,
        angle: action.game.angle
      })
      break
    case NOTIFY_LOGOUT:
      return Object.assign({}, state, {
        energy: 20,
        velocity: 10,
        angle: 0
      })
      break
    default:
      return state
  }
}

const pos = (state = {}, action = {}) => {
  switch (action.type) {
    case LOAD_USER:
      return Object.assign({}, state, {
        x: action.pos.x,
        y: action.pos.y
      })
      break
    case NOTIFY_LOGOUT:
      return Object.assign({}, state, {
        x: 0,
        y: 0
      })
      break
    default:
      return state
  }
}

const user = (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USERNAME:
      return Object.assign({}, state, {
        username: action.username,
        error: null,
        message: null
      })
      break
    case LOAD_USER:
      return Object.assign({}, state, {
        username: action.username,
        auth: auth(state.auth, action),
        score: score(state.score, action),
        game: game(state.game, action),
        pos: pos(state.pos, action),
        r: action.r,
        error: null,
        message: null,
        loading: false
      })
      break
    case INVALIDATE_LOGIN:
      return Object.assign({}, state, {
        error: action.error,
        message: null,
        loading: false
      })
      break
    case NOTIFY_LOGOUT:
      return Object.assign({}, state, {
        username: action.username,
        auth: auth(state.auth, action),
        score: score(state.score, action),
        game: game(state.game, action),
        pos: pos(state.pos, action),
        r: 0,
        message: action.message,
        error: null,
        loading: false
      })
      break
    case LOGIN:
    case LOGOUT:
      return Object.assign({}, state, {
        loading: true
      })
      break
    default:
      return state
  }
}

export default user
