import React from 'react'
import { connect } from 'react-redux'
import Grid from 'material-ui/Grid'
import Snackbar from 'material-ui/Snackbar'

import { createPalette, createMuiTheme, MuiThemeProvider, colors } from '../utils'
import Login from './Login.js'
import Display from './Display.js'
import { hideSocketNotification } from '../actions'

const Main = (props) => {
  const defaultTheme = {
    primary: colors.blue,  // indigo // blue // purple
    accent: colors.orange, // deepOrange // orange // teal
    type: 'light',
    error: colors.red
  }
  const applyTheme = (theme) => {
    return createMuiTheme({
      palette: createPalette(theme)
    })
  }
  const { auth, socket, closeNotification } = props
  return (
    <MuiThemeProvider theme={applyTheme(defaultTheme)}>
      <div>
        <Display/>
        <Grid container direction='row' align='center' justify='center' style={{ width: '100vw', height: '100vh' }}>
          <Grid item xs={8} md={8} md={6} lg={5} xl={3} style={{ zIndex: 1 }}>
            {auth.token ? <p>GAME</p> : <Login/>}
          </Grid>
        </Grid>
        <Snackbar onRequestClose={closeNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={socket.notification} autoHideDuration={5000} message={`${socket.connected ? 'Connected to' : 'Disconnected from'} server`}/>
      </div>
    </MuiThemeProvider>
  )
}

const injectState = (state) => {
  const { auth, socket } = state
  return {
    auth,
    socket
  }
}

const injectDispatch = (dispatch) => {
  return {
    closeNotification: () => dispatch(hideSocketNotification())
  }
}

export default connect(injectState, injectDispatch)(Main)
