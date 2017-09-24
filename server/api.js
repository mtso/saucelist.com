const express = require('express')
const Foodstuff = require('../models/Foodstuff')
const Savor = require('../models/Savor')
const Tag = require('../models/Tag')
const utils = require('./utils')

const api = module.exports = express.Router()

// POST /api/foodstuff
// {
//   "location": "Burger King",
//   "name": "Zesty Dipping Sauce"
// }
api.post('/foodstuff', utils.isAuthenticated, (req, res, next) => {
  const name = utils.toTitleCase(req.body.name).trim()
  const location = utils.toTitleCase(req.body.location).trim()
  const created_by = req.user.id
  
  Foodstuff.create({
    name,
    location,
    created_by,
  })
  .then((foodstuff) => {
    res.json({
      ok: true,
      foodstuff: JSON.parse(JSON.stringify(foodstuff)),
    })
    
    // Seed Savor collection.
    Savor
      .findOneAndUpdate({foodstuff_id: foodstuff._id, user_id: req.user._id}, {count: 0}, {upsert: true, new: true})
      .then(console.log) //(savor) => res.json({ok: true, savor}))
      .catch(console.error)
  })
  .catch(next)
})

api.get('/foodstuff', (req, res, next) => {
  let per_page = req.query.per_page
  let page = req.query.page
  let newest = req.query.newest || false
  
  const sortTags = (f) => {
    f.tags = utils.sortByOccurrence(f.tags)
    return f
  }
  
  return Savor.getAllLoggedIn(req.user && req.user._id, per_page, page, newest)
    .then((foodstuffs) => {
      foodstuffs = foodstuffs.map(sortTags)
      res.json({ok: true, foodstuffs})
    })
    .catch(next)
})

api.post('/foodstuff/:foodstuff_id/savor', utils.isAuthenticated, /* utils.isFoodstuffExists, */ (req, res, next) => {
  const foodstuff_id = req.params.foodstuff_id
  const user_id = req.user._id
  
  Savor
    .findOneAndUpdate({foodstuff_id, user_id}, {$inc: {count: 1}}, {upsert: true, new: true})
    .then((savor) => res.json({ok: true, savor}))
    .catch(next)
})

api.delete('/foodstuff/:foodstuff_id/savor', utils.isAuthenticated, /* utils.isFoodstuffExists, */ (req, res, next) => {
  const foodstuff_id = req.params.foodstuff_id
  const user_id = req.user._id
  
  Savor
    .findOneAndUpdate({foodstuff_id, user_id}, {count: 0}, {upsert: false})
    .then(() => res.json({ok: true, message: 'Savors removed'}))
    .catch(next)
})

api.delete('/foodstuff/:foodstuff_id/tag/:text', utils.isAuthenticated, /* utils.isFoodstuffExists, */ (req, res, next) => {
  const foodstuff_id = req.params.foodstuff_id
  const text = req.params.text
  const user_id = req.user._id
  
  Tag.remove({foodstuff_id, user_id, text})
    .then(() => res.json({ok: true, message: 'Tag removed'}))
    .catch(next)
})

api.post('/foodstuff/:foodstuff_id/tag/:text', utils.isAuthenticated, /* isFoodstuffExists, */ (req, res, next) => {
  const text = req.params.text.trim()
  const foodstuff_id = req.params.foodstuff_id
  const user_id = req.user._id
  
  Tag.create({
    text,
    foodstuff_id,
    user_id,
  })
  .then((tag) => {
    res.json({ok: true, tag})
  })
  .catch((err) => {
    res.status(400)
      .json({ok: false, message: err.message})
  })
})
