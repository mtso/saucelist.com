const Savor = require('../models/Savor')
const utils = require('./utils')

function renderState(req, res, next) {
  const sortTags = (f) => {
    f.tags = utils.sortByOccurrence(f.tags)
    return f
  }
  
  const isNew = req.path === '/new'
  
  Savor.getAllLoggedIn(req.user && req.user._id, null, null, isNew)
    .then((foodstuffs) => foodstuffs.map(sortTags))
    .then((foodstuffs) => {
      res.locals.state = {
        isLoggedIn: req.isAuthenticated(),
        foodstuffs,
      }
    
      next()
    })
    .catch(next)
}

module.exports = renderState
