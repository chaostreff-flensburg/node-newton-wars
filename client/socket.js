import io from 'socket.io-client'

import { connectSocket, disconnectSocket, loadUniverse, loginUser } from './actions'

class Socket {
  constructor () {
    this.connection = null
    this.dispatch = null
    this.connect = this.connect.bind(this)
    this.loadUniverse = this.loadUniverse.bind(this)
  }
  connect (dispatch) {
    this.dispatch = dispatch
    this.connection = io.connect('http://127.0.0.1:9000')
    this.connection.on('connect', () => {
      this.dispatch(connectSocket())
    })
    this.connection.on('disconnect', () => {
      this.dispatch(disconnectSocket())
    })
    this.connection.on('send-universe', (data) => {
      this.dispatch(loadUniverse(data))
    })
    this.connection.on('authorized', (data) => {
      this.dispatch(loginUser(data))
    })
  }
  loadUniverse () {
    this.connection.emit('request-universe')
  }
  login (username) {
    this.connection.emit('login', { username })
  }
}

export default new Socket()
