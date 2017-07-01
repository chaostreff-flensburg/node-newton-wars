import React, { Component } from 'react'
import { connect } from 'react-redux'

import socket from '../socket'

class Display extends Component {
  constructor(props) {
    super(props)
    this.ratios = {
      x: 0,
      y: 0,
      s: 0
    }
    this._resizeHandler = () => {
      /* Allows CSS to determine size of canvas */
      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight
      this.clearAndDraw()
    }
    this.drawPlanets = this.drawPlanets.bind(this)
  }
  componentWillMount () {
    socket.connect()
    socket.loadUniverse(this.props.dispatch)
  }
  componentDidMount() {
    window.addEventListener('resize', this._resizeHandler)
    /* Allows CSS to determine size of canvas */
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight
    this.clearAndDraw()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._resizeHandler);
  }
  componentDidUpdate() {
    this.clearAndDraw()
  }
  clearAndDraw () {
    this.ratios.x = Math.ceil(this.props.universe.dimensions.x / this.canvas.width)
    this.ratios.y = Math.ceil(this.props.universe.dimensions.y / this.canvas.height)
    this.ratios.s = Math.ceil((this.ratios.x + this.ratios.y))
    const ctx = this.canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawPlanets(ctx)
      // this.drawUsers(ctx)
    }
  }
  drawPlanets (ctx) {
    this.props.universe.planets.forEach((planet) => {
      const { x, y, s } = planet
      ctx.beginPath()
      ctx.arc(Math.ceil(x / this.ratios.x), Math.ceil(y / this.ratios.y), Math.ceil(s / this.ratios.s), 0, 2 * Math.PI)
      ctx.fillStyle = '#2196f3'
      ctx.fill()
    })
  }
  render () {
    const { absolute } = this.props
    return (
      <canvas ref={canvas => this.canvas = canvas} style={{ width: '100%', height: '100%', position: absolute ? 'absolute' : 'relative', zIndex: 0 }}/>
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
