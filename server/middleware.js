const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')
const auth = require('./auth')

const noCaching = (req, res, next) => {
  res.set('Cache-Control', 'max-age=1')
  next()
}

module.exports = [
  (_, res, next) => {
    const start = Date.now()
    const ogjson = res.json.bind(res)
    
    res.json = (obj) => {
      const responseTime = Date.now() - start
      res.set('X-RESPONSE-TIME', responseTime + 'ms')
      ogjson(obj)
    }
    
    next()
  },
  express.static('dist'),
  express.static('public'),
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
  bodyParser.urlencoded({extended: true}),
  bodyParser.json(),
  auth.initialize(),
  auth.session(),
  noCaching,
]
