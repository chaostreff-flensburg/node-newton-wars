import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Card, CardContent, CardActions, Typography } from 'material-ui'

import { setUsername, login } from '../actions'

class Login extends Component {
  constructor (props) {
    super()
    this.checkLogin = this.checkLogin.bind(this)
  }
  startGame () {

  }
  checkLogin (event) {
    const { user, joinGame } = this.props
    const key = event.keyCode || event.charCode || 0
    const { openConnection } = this.props
    if (key === 13 || event.target.id === 'login') {
      joinGame(user.username)
    }
  }
  componentWillMount () {
    document.body.addEventListener('keydown', this.checkLogin)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.checkLogin)
  }
  render () {
    const { auth, changeUsername } = this.props
    return (
      <Card>
        <CardContent>
          <Typography type='headline'>Newton wars</Typography>
          <Typography type='subheading' gutterBottom>Choose a username and join the game!</Typography>
          <TextField type='text' label='Username' placeholder='Username' onChange={changeUsername} autoCorrect='off' autoCapitalize='off' spellCheck='false' style={{ width: '100%' }}/>
        </CardContent>
        <CardActions>
          <Button id='login' raised color='primary' onClick={this.checkLogin}>Connect</Button>
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
    changeUsername: (event) => dispatch(setUsername(event.target.value)),
    joinGame: (username) => dispatch(login(username))
  }
}

export default connect(injectState, injectDispatch)(Login)
