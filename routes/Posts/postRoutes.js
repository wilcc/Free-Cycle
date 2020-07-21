const express = require('express');
const router = express.Router();
const Post = require('./models/Post');
const User = require('../Users/models/User');

router.get('/create-new', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('createNewPost');
  }
  return res.send('unauthorized');
});
router.post('/create-new', (req, res, next) => {
  console.log(req);
  const post = new Post();
  post.owner = req.user._id;
  post.text = req.body.text;
  post.image = req.body.image;
  post.category = req.body.category;
  post.title = req.body.title;
  post
    .save()
    .then((savedPost) => {
      return res.redirect(`/api/posts/single-post/${savedPost._id}`);
    })
    .catch((err) => {
      next(err);
    });
});
router.get('/get-all', (req, res, next) => {
  Post.find()
    .populate('owner')
    .exec((err, foundPost) => {
      if (err) return next(err);
      return res.render('main/allPost', { foundPost });
    });
});

router.get('/single-post/:id', (req, res, next) => {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.params.id })
      .populate('owner')
      .populate('comments')
      .exec((err, foundPost) => {
        if (err) {
          return next(err);
        } else {
          return res.render('main/singlePost', { foundPost });
        }
      });
  } else {
    return res.send('unauthorized');
  }
});
router.get('/get-category/:category', (req, res, next) => {
  if (req.isAuthenticated()) {
    Post.find({ category: req.params.category })
      .populate('owner')
      .exec((err, foundPost) => {
        if (err) {
          return next(err);
        } else {
          return res.render('main/allPost', { foundPost });
        }
      });
  }
});
router.get('/test', (req, res) => {
  return res.render('allPost');
});
router.get('/edit-post/:id', (req, res) => {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.params.id }).then((foundPost) => {
      console.log(req.user._id)
      console.log(foundPost.owner)
      if(req.user._id === foundPost.owner){

        return res.render('editPost', { foundPost });
      }
      res.send('You not the owner')
    });
  }
});
router.put('/edit-post/:id', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send('unauthorized');
  } else {
    Post.findOne({ _id: req.params.id })
      .populate('owner')
      .exec((err,foundPost) => {
        if(err){
          return next(err)
        }
          foundPost.text = req.body.text;
          foundPost.title = req.body.title;
          foundPost.category = req.body.category;
          foundPost.save().then((post) => {
            res.redirect(`/api/posts/single-post/${post._id}`);
          });
        }
      );
  }
});
module.exports = router;
