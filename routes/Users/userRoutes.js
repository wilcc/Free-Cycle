const express = require('express');
const router = express.Router();
const User = require('./models/User');
const passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/logged', (req, res) => {
  res.send('success');
});
router.get('/login',(req,res,next)=>{
  res.render('login')
})
router.get('/register',(req,res,next)=>{
  res.render('register')
})
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(401).json({ msg: 'User Already Exists' });

    user = await new User({ profile: { name }, email, password });
    console.log(user);
    user.save((err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'success', user });
    });
  } catch (error) {
    return res.status(500).json({ message: 'failed', error });
  }
});
router.post(
  '/login',
  passport.authenticate('local-login', {
    successRedirect: '/api/users/logged',
    failureRedirect: '/api/users/login',
    failureFlash: true,
  })
);
module.exports = router;
