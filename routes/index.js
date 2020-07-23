const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('landing');
});
router.get('/unauthorized',(req,res)=>{
  res.render('unauthorized')
})
module.exports = router;
