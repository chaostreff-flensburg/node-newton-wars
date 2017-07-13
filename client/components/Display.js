import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestUniverse } from '../actions'

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
    this.render = this.render.bind(this)
    this.drawCircle = this.drawCircle.bind(this)
    this.drawText = this.drawText.bind(this)
    this.drawGravity = this.drawGravity.bind(this)
    this.drawPlanets = this.drawPlanets.bind(this)
    this.drawUser = this.drawUser.bind(this)
    this.drawCurve = this.drawCurve.bind(this)
  }
  componentWillMount () {
    this.props.queryUniverse()
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
    this.scales.x = Math.ceil(this.props.universe.dimensions.x / this.canvas.width)
    this.scales.y = Math.ceil(this.props.universe.dimensions.y / this.canvas.height)
    this.scales.r = Math.ceil((this.scales.x + this.scales.y))
    const ctx = this.canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawGravity(ctx)
      this.drawPlanets(ctx)
      if (this.props.user.auth.token) this.drawUser(ctx)
      const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min)
      }
      const points = []
      if (this.props.user.auth.token) points.push(this.props.user.pos)
      for (let i = 0; i < 40; ++i) {
        points.push({ x: randomInt(0, this.canvas.width), y: randomInt(0, this.canvas.height) })
      }
      this.drawCurve(ctx, points)
    }
  }
  drawCurve (ctx, points) {
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length - 2; ++i) {
      const xc = (points[i].x + points[i + 1].x) / 2
      const yc = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
    }
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y)
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(255, 171, 64, 1.00)'
    ctx.stroke()
  }
  drawText (ctx, x, y, text, color) {
    ctx.font = '20px Arial'
    ctx.fillStyle = color
    ctx.fillText(text, x / this.scales.x + 10, y / this.scales.y + 20)
  }
  drawCircle (ctx, x, y, r, color) {
    ctx.beginPath()
    ctx.arc(Math.ceil(x / this.scales.x), Math.ceil(y / this.scales.y), Math.ceil(r / this.scales.r), 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }
  drawGravity (ctx) {
    this.props.universe.planets.forEach((planet) => {
      this.drawCircle(ctx, planet.pos.x, planet.pos.y, planet.r * 10, 'rgba(0, 0, 0, 0.05)')
    })
  }
  drawPlanets (ctx) {
    this.props.universe.planets.forEach((planet) => {
      this.drawCircle(ctx, planet.pos.x, planet.pos.y, planet.r, 'rgba(33, 150, 243, 1.00)')
    })
  }
  drawUser (ctx) {
    const { user } = this.props
    this.drawCircle(ctx, user.pos.x, user.pos.y, user.r, 'rgba(255, 171, 64, 1.00)')
    this.drawText(ctx, user.pos.x, user.pos.y, `[${user.score.kills}:${user.score.deaths}] ${user.username}`, 'rgba(0, 0, 0, 1.00)')
  }
  render () {
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}/>
    )
  }
}

const injectState = ({ universe, user }) => {
  return {
    universe,
    user
  }
}

const injectDispatch = (dispatch) => {
  return {
    queryUniverse: () => dispatch(requestUniverse())
  }
}

export default connect(injectState, injectDispatch)(Display)
