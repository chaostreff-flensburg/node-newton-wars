import React, { Component } from 'react'
import { connect } from 'react-redux'

import socket from '../socket'

class Display extends Component {
  constructor(props) {
    super(props)
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
    this.drawPlanets = this.drawPlanets.bind(this)
  }
  componentWillMount () {
    const { dispatch } = this.props
    socket.connect(dispatch)
    socket.loadUniverse()
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
    }
  }
  drawPlanets (ctx) {
    this.props.universe.planets.forEach((planet) => {
      const { x, y, } = planet.pos
      const r = planet.entitity
      ctx.beginPath()
      ctx.arc(Math.ceil(x / this.scales.x), Math.ceil(y / this.scales.y), Math.ceil(r / this.scales.r), 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(33, 150, 243, 1.00)'
      ctx.fill()
    })
  }
  drawGravity (ctx) {
    this.props.universe.planets.forEach((planet) => {
      const { x, y, } = planet.pos
      const r = planet.entitity
      ctx.beginPath()
      ctx.arc(Math.ceil(x / this.scales.x), Math.ceil(y / this.scales.y), Math.ceil(r / this.scales.r * 10), 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fill()
    })
  }
  render () {
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}/>
    )
  }
}

const injectState = ({ universe }) => {
  return {
    universe
  }
}

const injectDispatch = (dispatch) => ({ dispatch })

export default connect(injectState, injectDispatch)(Display)
