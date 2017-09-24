const mongoose = require('mongoose')

const SavorSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  foodstuff_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Foodstuff',
  },
  count: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: function(s) {
        return s <= 50
      },
      message: 'Reached maximum savors',
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

SavorSchema.index({user_id: 1, foodstuff_id: 1}, {unique: true})

SavorSchema.statics.increment = function(query) {
  return new Promise((resolve, reject) => {
    this.findOneAndUpdate(query, {
      user_id: query.user_id,
      foodstuff_id: query.foodstuff_id,
      $inc: {count: 1},
    }, {upsert: true, new: true}, function(err, savor) {
      if (err) {
        reject(err)
      } else {
        resolve(savor)
      }
    })
  })
}

SavorSchema.statics.getAll = function(per_page, page, newest) {
  const group = {
    $group: {
      _id: {foodstuff_id: '$foodstuff_id'}, 
      savor_count: { $sum: '$count' },
      // user_savor_count: { $max: '$user_savor_count' },
    }
  }
  
  const pickResult = {
    $project: {
      _id: 0,
      id: '$foodstuff._id',
      name: '$foodstuff.name',
      location: '$foodstuff.location',
      created_at: '$foodstuff.created_at',
      savor_count: '$savor_count',
      tags: {$map: {
        input: '$tags',
        as: 'tag',
        in: '$$tag.text',
      }},
    }
  }
  
  const $skip = per_page * (page - 1)
  const $limit = per_page
  
  newest = newest ? true : false

  return this
    .aggregate([
      {$match: {}},
      group,
      // {$sort: {savor_count: -1}},
    
      {$lookup: {
        from: 'foodstuffs',
        localField: '_id.foodstuff_id',
        foreignField: '_id',
        as: 'foodstuff',
      }},
      
    {$sort: {savor_count: -1, 'foodstuff.created_at': -1}},
    
    {$match: {'foodstuff.is_approved': {$exists: newest}}},
    
      {$skip},
      {$limit},

    {$unwind: '$foodstuff'},  

      {$lookup: {
        from: 'tags',
        localField: '_id.foodstuff_id',
        foreignField: 'foodstuff_id',
        as: 'tags',
      }},
      pickResult,
    ])
}

SavorSchema.statics.getAllLoggedIn = function(userId, per_page, page, newest) {
  per_page = per_page || 30
  page = page || 1
  newest = newest || false
  
  per_page = Math.max(per_page, 1)
  per_page = Math.min(per_page, 100)
  
  page = Math.max(page, 1)  
  
  if (!userId) {
    return this.getAll(per_page, page, newest)
  }
  
  const group = {
    $group: {
      _id: {foodstuff_id: '$foodstuff_id'}, 
      savor_count: { $sum: '$count' },
      user_savor_count: { $max: '$user_savor_count' },
    }
  }
  
  const pickResult = {
    $project: {
      _id: 0,
      id: '$foodstuff._id',
      name: '$foodstuff.name',
      location: '$foodstuff.location',
      created_at: '$foodstuff.created_at',
      savor_count: '$savor_count',
      user_savor_count: '$user_savor_count',
      tags: {$map: {
        input: '$tags',
        as: 'tag',
        in: '$$tag.text',
      }},
      user_tags: {$map: {
        input: '$user_tags',
        as: 'tag',
        in: '$$tag.text',
      }},
    }
  }
  
  const addUserSavorCount = {
    $addFields: {
      user_savor_count: {
        $cond: {
          if: {$eq: [userId, '$user_id']},
          then: '$count',
          else: null,
        },
      },
    }
  }
  
  const addUserTags = {$addFields: {
    user_tags: {
      $filter: {
        input: '$tags',
        as: 'tag',
        cond: {$eq: [userId, '$$tag.user_id']}
      }
    }
  }}

  const $skip = per_page * (page - 1)
  const $limit = per_page
  newest = newest ? true : false

  return this
    .aggregate([
      {$match: {}},
      addUserSavorCount,
      group,
    
      {$lookup: {
        from: 'foodstuffs',
        localField: '_id.foodstuff_id',
        foreignField: '_id',
        as: 'foodstuff',
      }},
    
      {$sort: {savor_count: -1, 'foodstuff.created_at': -1}},
    
    {$match: {'foodstuff.is_approved': {$exists: newest}}},

      {$skip},
      {$limit},
    
      {$unwind: '$foodstuff'},  
      {$lookup: {
        from: 'tags',
        localField: '_id.foodstuff_id',
        foreignField: 'foodstuff_id',
        as: 'tags',
      }},
      addUserTags,
    
    // {$addFields: {
    //   tag_array: {$map: {
    //           input: '$tags',
    //           as: 'tag',
    //           in: '$$tag.text',
    //         }}
    // }},
    // {$facet: {
    //   tag_count: [
    //     {
    //       $bucket: {
    //         groupBy: "$tags",
    //         boundaries: {$literal: '$tag_array'},
    //         default: {},
    //         output: {
    //           count: {$set: {$inc: 1}},
    //           // "count": { $sum: 1 },
    //           // "artwork": { $push: { "title": "$title", "year": "$year" } }
    //         }
    //       }
    //     }
    //   ]
    // }},
    
      pickResult,
    
    // {$facet: {
    //   tag_count: [
    //     {$project: {_id: 0, tags: 1}},
    //     {$group: {_id: 1, $count: '$tags'}}
    //     // {$unwind: '$tags'}
    //     // {$group: { $sum: '$tags'} }
    //   ]
    // }},
    
      // {$sortByCount: '$tags'},
    // {$unwind: '$tags'},
    // {$addFields: { tag_count: {$sortByCount: '$tags'}}},
    // {$facet: {
    //   tag_count: [
    //     // {$unwind: '$tags'},
    //     {$sortByCount: '$tags'},
    //   ]
    // }},
    
      // {$sort: {savor_count: -1}},
    ])
}

module.exports = mongoose.model('Savor', SavorSchema)
