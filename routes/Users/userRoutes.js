const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');
const {
  registerValidation,
  loginValidation,
  verifyLogin
} = require('./middleware/userValidation');
const { check, validationResult } = require('express-validator');
const { register,updateProfile,updatePassword } = require('./controller/controller');

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

router.post('/register', register);

router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/api/posts/get-all',
    failureRedirect: '/api/users/login',
    failureFlash: true,
  })
);
router.get('/logout', (req, res) => {
  // req.logout();
  res.clearCookie('connect.sid', {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  });
  req.session.destroy();
  // console.log('cookie', req.session);

  return res.redirect('/api/users/login');
});
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
const checkPassword = [
  check('oldPassword', 'Please Include a valid password').isLength({ min: 6 }),
  check('newPassword', 'Please Include a valid password').isLength({ min: 6 }),
  check('repeatNewPassword', 'Please Include a valid password').isLength({
    min: 6
  })
];

router.post('/update-password', checkPassword, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  try {
    updatePassword(req.body, req.user._id)
      .then(() => {
        return res.redirect('/api/users/profile');
      })
      .catch((err) => {
        console.log(err);
        req.flash('errors', 'Unable to Update user');
        return res.redirect('/api/users/update-profile');
      });
  } catch (errors) {
    console.log(errors);
  }
});
module.exports = router;
