import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from '../app'

const renderMarkup = ({ url, /*context,*/ state }) => {
  // context = context || {}
  const context = {}
  
  const markup = renderToString(
    <StaticRouter
      location={url}
      context={context}
    >
      <App state={state} />
    </StaticRouter>
  )
  
  return {
    markup,
    context,
  }
}

export default renderMarkup
