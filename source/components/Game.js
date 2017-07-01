import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Card, CardActions, CardContent, Typography, TextField, Table, TableHead, TableBody, TableRow, TableCell } from 'material-ui'

import { disconnectUser, shoot, setEnergy, setVelocity, setAngle } from '../actions'

const step = 1

class Game extends Component {
  constructor () {
    super()
    this.timer = this.timer.bind(this)
    this.keyboardControl = this.keyboardControl.bind(this)
    this.updater = null
  }
  timer () {
    this.props.applyEnergy(Number(this.props.game.energy) + 1)
  }
  keyboardControl (event) {
    const key = event.keyCode || event.charCode || 0
    const { game, fireAtWill, applyVelocity, applyAngle } = this.props
    switch (key) {
      case 37:
        applyAngle(Number(game.angle) - step)
        break
      case 38:
        applyVelocity(Number(game.velocity) + step)
        break
      case 39:
        applyAngle(Number(game.angle) + step)
        break
      case 40:
        applyVelocity(Number(game.velocity) - step)
        break
      case 13:
        fireAtWill()
    }
  }
  componentWillMount () {
    this.updater = setInterval(this.timer, 1000)
    document.body.addEventListener('keydown', this.keyboardControl)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.keyboardControl)
    clearInterval(this.updater)
  }
  render () {
    const { game, auth, closeConnection, fireAtWill, applyEnergy, applyVelocity, applyAngle } = this.props
    const { energy, velocity, angle } = game
    const { username } = auth
    return (
      <Card>
        <CardContent>
          <Typography type='headline'>Good luck, {username}!</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Setting</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Manual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Energy</TableCell>
                <TableCell>{energy}</TableCell>
                <TableCell>
                  <TextField placeholder='Energy' value={energy} onChange={(event) => applyEnergy(event.target.value)} disabled/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Velocity</TableCell>
                <TableCell>{velocity}</TableCell>
                <TableCell>
                  <TextField placeholder='Velocity' value={velocity} onChange={(event) => applyVelocity(event.target.value)}/>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Angle</TableCell>
                <TableCell>{angle}</TableCell>
                <TableCell>
                  <TextField placeholder='Angle' value={angle} onChange={(event) => applyAngle(event.target.value)}/>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardActions>
          <Button raised color='accent' onClick={closeConnection}>Disconnect</Button>
          <Button raised color='primary' onClick={fireAtWill}>Shoot</Button>
        </CardActions>
      </Card>
    )
  }
}

const injectState = ({ auth, game }) => {
  return {
    auth,
    game
  }
}

const injectDispatch = (dispatch) => {
  return {
    fireAtWill: () => dispatch(shoot()),
    applyEnergy: (energy) => dispatch(setEnergy(energy)),
    applyVelocity: (velocity) => dispatch(setVelocity(velocity)),
    applyAngle: (angle) => dispatch(setAngle(angle)),
    closeConnection: () => dispatch(disconnectUser())
  }
}

export default connect(injectState, injectDispatch)(Game)
