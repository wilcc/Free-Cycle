const express = require('express');
const router = express.Router();
const Post = require('./models/Post')


router.get('/create-new',(req,res)=>{
    res.render('createNewPost')
})
router.post('/create-new',(req,res,next)=>{
    const post = new Post()
    post.text = req.body.text
    post.image = req.body.image
    post.save().then((savedPost)=>{
        res.json({savedPost})
    }).catch((err)=>{next(err)})
}) 
router.get('/get-all',(req,res,next)=>{
    Post.find().then((foundpost)=>{
        res.json({foundpost})
    })
})
module.exports = router