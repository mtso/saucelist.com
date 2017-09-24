const mongoose = require('mongoose')

const FoodstuffSchema = new mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  // _savors: {
  //   type: Object,
  //   default: () => ({}),
  // },
  // _tags: {
  //   type: Object,
  //   default: () => ({}),
  // },
  // savors: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Savor',
  // }],
  // tags: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Tag',
  // }],
})

FoodstuffSchema.index({location: 1, name: 1}, {unique: true})

// FoodstuffSchema
//   .virtual('savor_count')
//   .get(function() {
//     return Object.keys(this._savors).reduce((sum, user_id) => {
//       const count = this._savors[user_id]
//       if (count) { return sum + count }
//       return sum
//     }, 0)
//     // return this.savors.reduce((sum, savor) => {
//     //   const count = savor.count
//     //   if (count) { sum += count }
//     //   return sum
//     // }, 0)
//   })

// FoodstuffSchema
//   .virtual('tags')
//   .get(function() {
//     return Object.keys(this._tags)
//   })

FoodstuffSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
})

FoodstuffSchema.statics.isIdExists = function(_id) {
  return new Promise((resolve, reject) => {
    this.findOne({_id}, function(err, foodstuff) {
      if (err) {
        reject(err)
      } else {
        resolve(!!foodstuff)
      }
    })
  })
}

module.exports = mongoose.model('Foodstuff', FoodstuffSchema)
