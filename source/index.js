import injectTapEventPlugin from 'react-tap-event-plugin'
import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import 'typeface-roboto'

injectTapEventPlugin()

import socket from './socket'

import { Main } from './components'
import store from './store'

window.reset = () => {
  socket.connect()
  socket.reloadUniverse(store.dispatch)
}

ReactDOM.render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('app')
)
