const express = require('express');
const middleware = require('./middleware')
const mongoose = require('mongoose')
const auth = require('./auth')
const api = require('./api')
const webpack = require('webpack')
const webpackConfig = require('../webpack.config')
const path = require('path')

const renderPage = require('./renderPage')
const renderMarkup = require('../dist/renderMarkup.js').default
const renderState = require('./renderState')

mongoose.connect(process.env.MONGODB_URI)

const app = express()

app.use(middleware)
app.use('/auth', auth.routes)
app.use('/api', api)

app.get("/test", function (request, response) {
  response.sendFile(path.resolve('views/test.html'))
})

app.get("/api.html", function (_, response) {
  response.sendFile(path.resolve('views/api.html'))
})

// app.get('/logout',
//   (req, res) => {
//     req.logout()
//     res.redirect('/')
//   })

app.get('/*', renderState, (req, res) => {
  const state = res.locals.state
  const result = renderMarkup({
    url: req.path,
    state,
  })
  
  if (result.context.url) {
    return res.redirect(302, result.context.url)
  } else {
    res
      .status(200)
      .send(renderPage(result.markup, state))
  }
})

// webpack(webpackConfig).run((err) => {
//   if (err) { throw err }
  
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
// })
