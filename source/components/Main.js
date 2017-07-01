import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'material-ui'

import { createPalette, createMuiTheme, MuiThemeProvider, colors } from '../utils'
import { Login, Game, Display } from '../components'

const Main = ({ auth }) => {
  const defaultTheme = {
    primary: colors.blue,  // indigo // blue // purple
    accent: colors.orange, // deepOrange // orange // teal
    type: 'dark',
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
        <img src='/morty.jpg' style={{ transform: 'rotate(45deg)', width: '10%', position: 'fixed', bottom: -32, left: -24 }}/>
        <Display absolute/>
        <Grid container direction='row' align='center' justify='center' style={{ width: '100vw', height: '100vh' }}>
          <Grid item xs={8} md={8} md={6} lg={5} xl={3} style={{ zIndex: 1 }}>
            {auth.token ? <Game/> : <Login/>}
          </Grid>
        </Grid>
      </div>
    </MuiThemeProvider>
  )
}

const injectState = ({ auth }) => {
  return {
    auth
  }
}

export default connect(injectState)(Main)
