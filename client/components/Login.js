import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Card, CardContent, CardActions, Typography } from 'material-ui'

import { setUsername, login } from '../actions'

class Login extends Component {
  constructor (props) {
    super()
    this.handleKeypress = this.handleKeypress.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.startGame = this.startGame.bind(this)
  }
  startGame () {
    const { user, joinGame } = this.props
    joinGame(user.username)
  }
  handleKeypress (event) {
    const key = event.keyCode || event.charCode || 0
    if (key === 13) this.startGame()
  }
  handleClick () {
    this.startGame()
  }
  componentWillMount () {
    document.body.addEventListener('keydown', this.handleKeypress)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.handleKeypress)
  }
  render () {
    const { user, changeUsername } = this.props
    return (
      <Card>
        <CardContent>
          <Typography type='headline'>Newton wars</Typography>
          <Typography type='subheading' gutterBottom>Choose a username and join the game!</Typography>
          {user.error && <Typography style={{ color: '#ff1744' }} gutterBottom><b>{user.error}</b></Typography>}
          {user.message && <Typography style={{ color: '#2196f3' }} gutterBottom><b>{user.message}</b></Typography>}
          <TextField type='text' label='Username' placeholder='Username' onChange={changeUsername} value={user.username} autoCorrect='off' autoCapitalize='off' spellCheck='false' style={{ width: '100%' }}/>
        </CardContent>
        <CardActions>
          <Button id='login' raised color='primary' onClick={this.handleClick} disabled={user.loading}>Connect</Button>
        </CardActions>
      </Card>
    )
  }
}

const injectState = ({ user }) => {
  return {
    user
  }
}

const injectDispatch = (dispatch) => {
  return {
    changeUsername: (event) => dispatch(setUsername(event.target.value.trim())),
    joinGame: (username) => dispatch(login(username))
  }
}

export default connect(injectState, injectDispatch)(Login)
