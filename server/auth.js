const express = require('express')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const InstagramStrategy = require('passport-instagram').Strategy

const User = require('../models/User')

const hostname = process.env.HOSTNAME

const twitterStrategy = new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackUrl: hostname + '/auth/twitter/callback',
  },
  (_, __, profile, done) => User.findOrCreate({auth_id: 'tw-' + profile.id}, done)
)

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: hostname + '/auth/google/callback',
  },
  (_, __, profile, done) => User.findOrCreate({auth_id: 'gl-' + profile.id}, done)
)

const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: hostname + '/auth/facebook/callback',
  },
  (_, __, profile, done) => User.findOrCreate({auth_id: 'fb-' + profile.id}, done)
)

const instagramStrategy = new InstagramStrategy({
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: hostname + '/auth/instagram/callback',
  },
  (_, __, profile, done) => User.findOrCreate({auth_id: 'ig-' + profile.id}, done)
)

const strategies = [
  twitterStrategy,
  googleStrategy,
  facebookStrategy,
  instagramStrategy,
]

strategies.forEach((s) => passport.use(s))

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((_id, done) => {
  User.findOne({_id}, done)
})

const router = express.Router()
const redirects = {
  failureRedirect: '/signin',
  successRedirect: '/',
}

strategies.forEach((s) => {
  router.get(`/${s.name}`,
    passport.authenticate(s.name, s.name === 'google' ? {scope: ['profile']} : null))
  
  router.get(`/${s.name}/callback`,
    passport.authenticate(s.name, redirects))
})

// router.get('/twitter',
//   passport.authenticate('twitter'))

// router.get('/twitter/callback',
//   passport.authenticate('twitter', redirects))

// router.get('/google',
//   passport.authenticate('google', {scope: ['profile']}))

// router.get('/google/callback',
//   passport.authenticate('google', redirects))

// router.get('/facebook',
//   passport.authenticate('facebook'))

// router.get('/facebook/callback',
//   passport.authenticate('facebook', redirects))

// router.get('/instagram',
//   passport.authenticate('instagram'))

// router.get('/instagram/callback',
//   passport.authenticate('instagram', redirects))

router.get('/logout',
  (req, res) => {
    req.logout()
    res.redirect('/')
  })

module.exports = passport
module.exports.routes = router
