const express = require('express');
const router = express.Router();
const Post = require('./models/Post')


router.get('/create-new',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('createNewPost')
    }
    res.send('unauthorized')
})
router.post('/create-new',(req,res,next)=>{
    const post = new Post()
    post.text = req.body.text
    post.image = req.body.image
    post.save().then((savedPost)=>{
        res.redirect(`/api/posts/single-post/${savedPost._id}`)
    }).catch((err)=>{next(err)})
}) 
router.get('/get-all',(req,res,next)=>{
    Post.find().then((foundPost)=>{
        res.render('main/allPost',{foundPost})
    })
})

router.get('/single-post/:id',(req,res,next)=>{
    if(req.isAuthenticated()){
        Post.find({_id: req.params.id}).then((foundPost)=>{
            res.render('main/singlePost',{foundPost})
        })
    }
    res.send('unauthorized')
})

router.get('/test',(req,res)=>{
    res.render('allPost')
})
module.exports = router