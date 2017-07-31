import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestUniverse, requestPlayers } from '../actions'
import { applyScales, applyContext, getScales, clearCanvas, drawCurve, drawCircle, drawText, drawImage } from '../canvas'
import { Vector, randomInt, radToDeg } from '../math'

class Display extends Component {
  constructor(props) {
    super(props)
    this.image = new Image()
    this.image.src = `/leuchtturmrakede.svg`
    this.mouse = new Vector()
    this.scales = new Vector()
    this.direction = new Vector()
    this._resizeHandler = () => {
      // allows CSS to determine size of canvas
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.renderCanvas()
    }
    this._mousemoveHandler = (e) => {
      const { user } = this.props
      this.scales = getScales()
      this.mouse = new Vector(e.clientX, e.clientY)
      this.renderCanvas()
    }
    this.renderCanvas = this.renderCanvas.bind(this)
    this.drawPlanet = this.drawPlanet.bind(this)
    this.drawUser = this.drawUser.bind(this)
    this.drawPlayer = this.drawPlayer.bind(this)
  }
  componentWillMount () {
    this.props.queryUniverse()
    this.props.queryPlayers()
  }
  componentDidMount () {
    window.addEventListener('mousemove', this._mousemoveHandler, false)
    window.addEventListener('resize', this._resizeHandler)
    // allows CSS to determine size of canvas
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.renderCanvas()
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', this._mousemoveHandler, false)
    window.removeEventListener('resize', this._resizeHandler)
  }
  componentDidUpdate() {
    this.renderCanvas()
  }
  renderCanvas () {
    const { universe, players, user } = this.props
    const { planets, dimensions } = universe
    const context = this.canvas.getContext('2d')
    applyScales(dimensions, { x: this.canvas.width, y: this.canvas.height })
    applyContext(context)
    if (context) {
      clearCanvas()
      planets.forEach((planet) => {
        this.drawPlanet(planet)
      })
      if (user.auth.token) {
        this.direction = new Vector(this.mouse.x - user.pos.x / this.scales.x, this.mouse.y - user.pos.y / this.scales.y)
        this.drawUser(user)
      }
      if (players.length) {
        players.forEach((player) => {
          this.drawPlayer(player)
        })
      }
    }
  }
  drawPlanet (planet) {
    drawCircle(planet.pos, planet.r, 'rgba(33, 150, 243, 1.00)')
  }
  drawUser (user) {
    drawImage(user.pos, this.image, user.r * 2.5, this.direction.angle() + Math.PI / 2)
    drawText(user.pos, `[${user.score.kills}:${user.score.deaths}] ${user.username}`, 'rgba(0, 0, 0, 1.00)', 10, 20, 'auto')
  }
  drawPlayer (player) {
    drawCircle(player.pos, player.r, 'rgba(255, 171, 64, 1.00)')
    drawText(player.pos, `[${player.score.kills}:${player.score.deaths}] ${player.username}`, 'rgba(0, 0, 0, 1.00)', 10, 20, 'auto')
  }
  render () {
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}/>
    )
  }
}

const injectState = ({ universe, user, players }) => {
  return {
    universe,
    user,
    players
  }
}

const injectDispatch = (dispatch) => {
  return {
    queryUniverse: () => dispatch(requestUniverse()),
    queryPlayers: () => dispatch(requestPlayers())
  }
}

export default connect(injectState, injectDispatch)(Display)
