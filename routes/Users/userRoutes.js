const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');
const { register } = require('./controller/controller');

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
module.exports = router;
