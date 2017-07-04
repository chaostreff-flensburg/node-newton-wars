import React from 'react'
import { connect } from 'react-redux'
import { Grid, Snackbar, Typography } from 'material-ui'

import { createPalette, createMuiTheme, MuiThemeProvider, colors } from '../utils'
import { Login, Game, Display } from '../components'
import { hideSocketNotification } from '../actions'

const Main = ({ auth, socket, closeNotification }) => {
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
  return (
    <MuiThemeProvider theme={applyTheme(defaultTheme)}>
      <div>
        <Display/>
        <Grid container direction='row' align='center' justify='center' style={{ width: '100vw', height: '100vh' }}>
          <Grid item xs={8} md={8} md={6} lg={5} xl={3} style={{ zIndex: 1 }}>
            {auth.token ? <Game/> : <Login/>}
          </Grid>
        </Grid>
        <Snackbar onRequestClose={closeNotification} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={socket.notification} autoHideDuration={5000} message={`${socket.connected ? 'Connected to' : 'Disconnected from'} server`}/>
      </div>
    </MuiThemeProvider>
  )
}

const injectState = ({ auth, socket }) => {
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

const Ready = connect(injectState, injectDispatch)(Main)

export default Ready

console.log(Ready)
