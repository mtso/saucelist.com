const Foodstuff = require('../models/Foodstuff')

function isFoodstuffExists(req, res, next) {
  const foodstuff_id = req.params.foodstuff_id
  
  Foodstuff
    .isIdExists(foodstuff_id)
    .then((isIdExists) => {
      if (isIdExists) {
        next()
      } else {
        res.status(404).json({ok: false, message: 'Foodstuff not found'})
      }
    })
    .catch(next)
}

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.status(401).json({
    ok: false,
    message: 'Not logged in.',
  })
}

function sortByOccurrence(array) {
  const count_table = array.reduce((bucket, t) => {
    bucket[t] = bucket[t] + 1 || 1
    return bucket
  }, {})
  const count_array = Object.keys(count_table).map((id) => {
    return {
      id,
      count: count_table[id],
    }
  })

  return count_array.sort((a, b) => b.count - a.count).map((el) => el.id)
}

const toTitleCase = (string) => {
  const capitalize = (word) => 
    word.slice(0, 1).toUpperCase() + 
    word.slice(1)

  return string
    .split(' ')
    .map(capitalize)
    .join(' ')
}

module.exports = {
  isFoodstuffExists,
  isAuthenticated,
  sortByOccurrence,
  toTitleCase,
}
