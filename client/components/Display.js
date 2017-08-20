import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestUniverse, requestPlayers, shootRocket } from '../actions'
import { setScales, setContext, getScales, clearCanvas, drawCurve, drawCircle, drawText, drawImage } from '../canvas'
import { Vector, round } from '../math'

class Display extends Component {
  constructor(props) {
    super(props)
    this.image = new Image()
    this.image.src = `/leuchtturmrakede.svg`
    this.mouse = new Vector()
    this.scales = new Vector()
    this.direction = new Vector()
    this.velocity = 0
    this._resizeHandler = () => {
      // allows CSS to determine size of canvas
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.drawCanvas()
    }
    this._mousemoveHandler = (e) => {
      this.scales = getScales()
      this.mouse = new Vector(e.clientX, e.clientY)
      this.drawCanvas()
    }
    this._clickHandler = (e) => {
      const { user, fireRocket } = this.props
      if (this.velocity && e.which === 1 && user.auth.token) {
        fireRocket(this.velocity, this.direction.angle())
      }
    }
    this.drawCanvas = this.drawCanvas.bind(this)
    this.drawPlanet = this.drawPlanet.bind(this)
    this.drawUser = this.drawUser.bind(this)
    this.drawPlayer = this.drawPlayer.bind(this)
  }
  componentWillMount () {
    this.props.queryUniverse()
    this.props.queryPlayers()
  }
  componentDidMount () {
    window.addEventListener('resize', this._resizeHandler)
    window.addEventListener('mousemove', this._mousemoveHandler)
    window.addEventListener('mousedown', this._clickHandler)
    // allows CSS to determine size of canvas
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.drawCanvas()
  }
  componentWillUnmount () {
    window.removeEventListener('mousemove', this._mousemoveHandler)
    window.removeEventListener('resize', this._resizeHandler)
    window.addEventListener('mousedown', this._clickHandler)
  }
  componentDidUpdate() {
    this.drawCanvas()
  }
  drawCanvas () {
    const { universe, players, user } = this.props
    const { planets, dimensions } = universe
    const context = this.canvas.getContext('2d')
    setScales(dimensions, { x: this.canvas.width, y: this.canvas.height })
    setContext(context)
    if (context) {
      clearCanvas()
      planets.forEach((planet) => {
        this.drawPlanet(planet)
      })
      if (user.auth.token) {
        this.direction = new Vector(this.mouse.x - user.pos.x / this.scales.x, this.mouse.y - user.pos.y / this.scales.y)
        this.velocity = Number(this.direction.longitude() > 200 ? (10).toFixed(2) : round(this.direction.longitude() / 20, 2).toFixed(2))
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
    drawText(user.pos, `[${user.score.kills}:${user.score.deaths}] ${user.username} v:${this.velocity}`, 'rgba(0, 0, 0, 1.00)', 10, 20, 'auto')
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
    fireRocket: (velocity, angle) => dispatch(shootRocket(velocity, angle)),
    queryUniverse: () => dispatch(requestUniverse()),
    queryPlayers: () => dispatch(requestPlayers())
  }
}

export default connect(injectState, injectDispatch)(Display)
