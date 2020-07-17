const express = require('express');
const router = express.Router();
const Post = require('./models/Post')
const User = require('../Users/models/User')

router.get('/create-new',(req,res)=>{
    if(req.isAuthenticated()){
        return res.render('createNewPost')
    }
    return res.send('unauthorized')
})
router.post('/create-new',(req,res,next)=>{
    const post = new Post()
    post.owner = req.user._id
    post.text = req.body.text
    post.image = req.body.image
    post.save().then((savedPost)=>{
        return res.redirect(`/api/posts/single-post/${savedPost._id}`)
    }).catch((err)=>{next(err)})
}) 
router.get('/get-all',(req,res,next)=>{
    Post.find().then((foundPost)=>{
        return res.render('main/allPost',{foundPost})
    })
})

router.get('/single-post/:id',(req,res,next)=>{
    if(req.isAuthenticated()){
        Post.find({_id: req.params.id}).then((foundPost)=>{
            return res.render('main/singlePost',{foundPost})
        })
    }
    return res.send('unauthorized')
})

router.get('/test',(req,res)=>{
    return res.render('allPost')
})
module.exports = router