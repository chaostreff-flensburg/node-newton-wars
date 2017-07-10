import injectTapEventPlugin from 'react-tap-event-plugin'
import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import 'typeface-roboto'

import { Main } from './components'
import store from './store'

injectTapEventPlugin()

ReactDOM.render(
  <Provider store={store}>
    <Main/>
  </Provider>,
  document.getElementById('app')
)
