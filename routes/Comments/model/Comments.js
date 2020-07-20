const mongoose = require('mongoose')
const moment = require('moment')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    originalPost:{type:Schema.Types.ObjectId,ref:'post'},
    owner: String,
    text: String,
    timestamp:{
        type: String,
        default: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
      },

})


module.exports= mongoose.model('comment',CommentSchema)