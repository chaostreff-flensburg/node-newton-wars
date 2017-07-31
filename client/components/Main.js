import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid'
import Snackbar from 'material-ui/Snackbar'

import { createPalette, createMuiTheme, MuiThemeProvider, colors } from '../utils'
import { Login, Display } from '../components'
import { hideSocketNotification, connectSocket } from '../actions'

class Main extends Component {
  constructor () {
    super()
    this.applyTheme = this.applyTheme.bind(this)
  }
  componentWillMount () {
    this.props.openSocket()
  }
  applyTheme (theme) {
    return createMuiTheme({
      palette: createPalette(theme)
    })
  }
  render () {
    const { user, socketio, closeNotification } = this.props
    const defaultTheme = {
      primary: colors.blue,  // indigo // blue // purple
      accent: colors.orange, // deepOrange // orange // teal
      type: 'light',
      error: colors.red
    }
    return (
      <MuiThemeProvider theme={this.applyTheme(defaultTheme)}>
        <div>
          <Display/>
          <Grid container direction='row' align='center' justify='center' gutter={0} style={{ width: '100%', height: '100vh' }}>
            <Grid item xs={8} md={8} md={6} lg={5} xl={3} style={{ zIndex: 1 }}>
              {!user.auth.token && <Login/>}
            </Grid>
          </Grid>
          <Snackbar onRequestClose={closeNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={socketio.notification} autoHideDuration={5000} message={`${socketio.connected ? 'Connected to' : 'Disconnected from'} server`}/>
        </div>
      </MuiThemeProvider>
    )
  }
}

const injectState = ({ user, socketio }) => {
  return {
    user,
    socketio
  }
}

const injectDispatch = (dispatch) => {
  return {
    closeNotification: () => dispatch(hideSocketNotification()),
    openSocket: () => dispatch(connectSocket())
  }
}

export default connect(injectState, injectDispatch)(Main)
