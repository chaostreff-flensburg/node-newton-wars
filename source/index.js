import injectTapEventPlugin from 'react-tap-event-plugin'
import ReactDOM from 'react-dom'
import React from 'react'
import 'typeface-roboto'

injectTapEventPlugin()

ReactDOM.render(
  <div>
    <h1>react-sandbox-boilerplate</h1>
    <p>
      Much visible code. Such no reading docs. Wow.
      <br/>
      <b>- Doge, 2017</b>
    </p>
    <p>
      A highly customizable react boilerplate using webpack's node API.
    </p>
  </div>,
  document.getElementById('app')
)
