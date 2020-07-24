const Comment = require('../model/Comments')
const Post = require('../../Posts/models/Post');

module.exports={
    addComment:(req,res,next)=>{
        const origin = req.params.id
        Post.findOne({_id:origin}).then((foundPost)=>{
    
            const newComment = new Comment()
    
            newComment.text = req.body.comment
            newComment.originalPost = foundPost._id
            newComment.owner.name = req.user.profile.name
            newComment.owner.id = req.user._id
            newComment.save().then((comment)=>{
                foundPost.comments.push(comment._id)
                foundPost.save()
                .then((post)=>{
                    req.user.comment.push(comment._id)
                    req.user.save()
                    res.redirect(`/api/posts/single-post/${foundPost._id}`)
                }).catch((err)=>console.log(err))
                
            })
    
    
        }).catch((err)=>console.log(err))
    }
}