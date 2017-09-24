import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from '../app/index.js'

const initialState = window.__PRELOADED_STATE__ || {}

const markup = render(
  <BrowserRouter>
    <App state={initialState} />
  </BrowserRouter>,
  document.querySelector('#app')
)
