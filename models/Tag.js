const mongoose = require('mongoose')

const TagSchema = new mongoose.Schema({
  foodstuff_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

TagSchema.index({foodstuff_id: 1, user_id: 1, text: 1}, {unique: true})

module.exports = mongoose.model('Tag', TagSchema)
