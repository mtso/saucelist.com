const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')

const UserSchema = new mongoose.Schema({
  auth_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

UserSchema.plugin(findOrCreate)

UserSchema.set('toObject', {
  versionKey: false,
})

UserSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('User', UserSchema)
