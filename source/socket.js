import io from 'socket.io-client'

import { loadUniverse } from './actions'

class Socket {
  constructor () {
    this.connection = null
    this.connected = false
    this.connect = this.connect.bind(this)
    this.loadUniverse = this.loadUniverse.bind(this)
    this.reloadUniverse = this.reloadUniverse.bind(this)
  }
  connect () {
    this.connection = io.connect('http://172.16.0.166:9000/map')
    this.connection.on('connect', () => {
      console.log('[SIO] Connected!')
      this.connected = true
    })
    this.connection.on('disconnect', () => {
      console.log('[SIO] Disconnected!')
      this.connected = false
    })
    this.connection.on('reconnect', () => {
      console.log('[SIO] Reconnected!')
      this.connected = true
    })
  }
  loadUniverse (dispatch) {
    this.connection.emit('request-map')
    this.connection.on('send-map', (data) => {
      dispatch(loadUniverse(data))
    })
  }
  reloadUniverse (dispatch) {
    this.connection.emit('reset')
    this.connection.on('send-map', (data) => {
      dispatch(loadUniverse(data))
    })
  }
}
/*
const socket = {}

socket.connectViewer = () => {

}
  const context = this.context
  const pristine = this.pristine

  const socket = io.connect('http://172.16.0.166:9000/map')
socket.on('connect', () => {
  console.log('[SIO] Connected!')
  socket.emit('request-map')
})
  socket.on('send-map', function (data) {
    canvas.xRatio = data.xSize / canvas.xActualSize
    canvas.yRatio = data.ySize / canvas.yActualSize
    data.planets.forEach((planet) => {
      console.log(planet)
      context.beginPath()
      context.arc(Math.ceil(planet.x / canvas.xRatio), Math.ceil(planet.y / canvas.yRatio), Math.ceil(planet.s / (canvas.xRatio + canvas.yRatio) / 2), 0, 2 * Math.PI)
      context.fillStyle = '#2196f3'
      context.fill()
      context.stroke()
    })
  })
  socket.on('clear-map', function () {
    context.clearRect(0, 0, canvas.xActualSize, canvas.yActualSize)
  })

*/

export default new Socket()
