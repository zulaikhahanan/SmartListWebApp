const express = require('express');
const router = express.Router();
const passport = require('passport');
const {forwardAuthenticated } = require('../config/auth');

router.get('/todolist', function(req, res, next) {
    res.render('todolist');
  });

module.exports = router;