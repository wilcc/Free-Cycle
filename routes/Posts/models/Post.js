const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'user'},
    comments:[{type: Schema.Types.ObjectId, ref: 'comment'}],
    title:{type:String,required:true},
    text: {type: String,required:true},
    image: [],
    category: {type: String},
    timestamp: {
        type: String,
        default: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
      },
})

module.exports = mongoose.model('post', PostSchema)
