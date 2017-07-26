import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestUniverse, requestPlayers } from '../actions'
import { applyScales, applyContext, clearCanvas, drawCurve, drawCircle, drawText } from '../canvas'

class Display extends Component {
  constructor(props) {
    super()
    this.scales = {
      x: 0,
      y: 0,
      s: 0
    }
    this._resizeHandler = () => {
      /* Allows CSS to determine size of canvas */
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.renderCanvas()
    }
    this.renderCanvas = this.renderCanvas.bind(this)
    this.drawPlanet = this.drawPlanet.bind(this)
    this.drawPlayer = this.drawPlayer.bind(this)
  }
  componentWillMount () {
    this.props.queryUniverse()
    this.props.queryPlayers()
  }
  componentDidMount() {
    window.addEventListener('resize', this._resizeHandler)
    /* Allows CSS to determine size of canvas */
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.renderCanvas()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeHandler);
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
    this.scales.x = dimensions.x / this.canvas.width
    this.scales.y = dimensions.y / this.canvas.height
    this.scales.r = (this.scales.x + this.scales.y) / 2
    if (context) {
      clearCanvas()
      planets.forEach((planet) => {
        this.drawPlanet(planet)
      })
      if (user.auth.token) this.drawPlayer(this.props.user)
      if (players.length) {
        players.forEach((player) => {
          this.drawPlayer(player)
        })
      }
      const randomInt = (min, max) => {
        return Math.ceil(Math.random() * (max - min) + min)
      }
      const points = []
      if (this.props.user.auth.token) points.push(this.props.user.pos)
      for (let i = 0; i < 40; ++i) {
        points.push({ x: randomInt(0, this.canvas.width), y: randomInt(0, this.canvas.height) })
      }
      drawCurve(points, 'rgba(255, 171, 64, 1.00)', 2)
    }
  }
  drawPlanet (planet) {
    drawCircle(planet.pos.x, planet.pos.y, planet.r, 'rgba(33, 150, 243, 1.00)')
  }
  drawPlayer (player) {
    drawCircle(player.pos.x, player.pos.y, player.r, 'rgba(255, 171, 64, 1.00)')
    drawText(player.pos.x, player.pos.y, `[${player.score.kills}:${player.score.deaths}] ${player.username}`, 'rgba(0, 0, 0, 1.00)', 10, 20, 'auto')
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
