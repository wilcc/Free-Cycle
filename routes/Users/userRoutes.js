const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');
const {
  registerValidation,
  loginValidation,
  verifyLogin,
  checkPassword
} = require('./middleware/userValidation');

const { validationResult } = require('express-validator');
const { register,updateProfile,updatePassword,logout } = require('./controller/controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/logged', (req, res) => {
  res.redirect('api/posts/get-all');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.get('/register', (req, res, next) => {
  res.render('register');
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
  return res.render('update-profile');
});

router.get('/profile', (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.render('profile');
  }
  return res.send('Unauthorized');
});

router.post('/update-profile', (req, res, next) => {
  updateProfile(req.body, req.user._id)
    .then(() => {
      return res.redirect(301, '/api/users/profile');
    })
    .catch((err) => next(err));
});


router.post('/update-password', checkPassword, async (req, res, next) => {
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
