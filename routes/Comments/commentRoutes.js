const express = require('express');
const router = express.Router();
const {addComment} = require('./controller/controller')


router.post('/add-comment/:id',addComment)


module.exports=router