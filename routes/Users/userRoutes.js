const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  registerValidation,
  loginValidation,
  verifyLogin,
  checkPassword
} = require('./middleware/userValidation');

const { validationResult } = require('express-validator');
const { register,updateProfile,updatePassword,logout } = require('./controller/controller');
const User = require('./models/User');
const Post = require('../Posts/models/Post');

/* GET users listing. */
router.get('/', function (req, res) {
  return res.send('respond with a resource');
});

router.get('/logged', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('api/posts/get-all');
  }
  return res.redirect('/');
});

router.get('/login', (req, res) => {

  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('login');
});

router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return res.render('register');
});

router.post('/register', registerValidation, register);

router.post(
  '/login',
  [loginValidation,verifyLogin],
  passport.authenticate('local-login', {
    successRedirect: '/api/posts/get-all',
    failureRedirect: '/api/users/login',
    failureFlash: true,
  })
);
router.get('/logout', logout);

router.get('/update-profile', (req, res) => {
  if (req.isAuthenticated()) {
    return res.render('update-profile');
  }
  return res.redirect('/unauthorized');
});
router.get('/view-profile/:id',(req,res,next)=>{
  if(req.isAuthenticated()){
    User.findOne({_id:req.params.id}).then((foundUser)=>{
      Post.find({owner:foundUser._id}).then((foundPosts)=>{

        return res.render('viewProfile',{foundUser,foundPosts})
      })
    })
  }
})
router.get('/profile', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.render('profile');
  }
  return res.redirect('/unauthorized');
});

router.put('/update-profile', (req, res, next) => {
  updateProfile(req.body, req.user._id)
    .then(() => {
      return res.redirect(301, '/api/users/profile');
    })
    .catch((err) => next(err));
});


router.put('/update-password', checkPassword, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    updatePassword(req.body, req.user._id)
      .then(() => {
        return res.redirect('/api/users/profile');
      })
      .catch((err) => {
        next(err)
        req.flash('errors', 'Unable to Update user');
        return res.redirect('/api/users/update-profile');
      });
  } catch (errors) {
    next(errors)
  }
});
module.exports = router;
