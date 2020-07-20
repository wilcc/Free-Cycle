const express = require('express');
const router = express.Router();
const Comment = require('./model/Comments')
const Post = require('../Posts/models/Post');
const User = require('../Users/models/User')



router.post('/add-comment/:id',(req,res,next)=>{
    const origin = req.params.id
    Post.findOne({_id:origin}).then((foundPost)=>{

        const newComment = new Comment()

        newComment.comment = req.body.comment
        newComment.originalPost = foundPost._id
        newComment.owner = req.user._id

        newComment.save().then((comment)=>{
            foundPost.comments.push(comment._id)
            foundPost.save()
            .then((post)=>{
                console.log(post.timestamp)
                res.redirect(`/api/posts/single-post/${foundPost._id}`)
                // res.json({word,comment})
            })
            
        })


    }).catch((err)=>console.log(err))
})


module.exports=router