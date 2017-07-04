import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextField, Button, Card, CardContent, CardActions, Typography } from 'material-ui'

import { setUsername } from '../actions'

class Login extends Component {
  constructor (props) {
    super()
    this.keyboardControl = this.keyboardControl.bind(this)
  }
  keyboardControl (event) {
    const key = event.keyCode || event.charCode || 0
    const { openConnection } = this.props
    if (key === 13) {
      openConnection()
    }
  }
  componentWillMount () {
    document.body.addEventListener('keydown', this.keyboardControl)
  }
  componentWillUnmount () {
    document.body.removeEventListener('keydown', this.keyboardControl)
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
          <Button raised color='primary'>Connect</Button>
        </CardActions>
      </Card>
    )
  }
}

const injectState = ({ auth }) => {
  return {
    auth
  }
}

const injectDispatch = (dispatch) => {
  return {
    changeUsername: (event) => dispatch(setUsername(event.target.value))
  }
}

export default connect(injectState, injectDispatch)(Login)
