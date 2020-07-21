const express = require('express');
const router = express.Router();
const Post = require('./models/Post');
const Comment = require('../Comments/model/Comments');
const {
  deletePost,
  editPost,
  getSinglePost,
  getCategory,
  createNewPost,
} = require('./controller/controller');
router.get('/create-new', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('createNewPost');
  }
  return res.send('unauthorized');
});
router.post('/create-new', createNewPost);
router.get('/get-all', (req, res, next) => {
  Post.find()
    .populate('owner')
    .exec((err, foundPost) => {
      if (err) return next(err);
      return res.render('main/allPost', { foundPost });
    });
});

router.get('/single-post/:id', getSinglePost);
router.get('/get-category/:category', getCategory);

router.get('/edit-post/:id', (req, res) => {
  if (req.isAuthenticated()) {
    Post.findOne({ _id: req.params.id }).then((foundPost) => {
      if (JSON.stringify(req.user._id) === JSON.stringify(foundPost.owner)) {
        console.log('here');
        return res.render('editPost', { foundPost });
      }
      res.send('You not the owner');
    });
  }
});
router.put('/edit-post/:id', editPost);
router.delete('/single-post/:id', deletePost);
module.exports = router;
