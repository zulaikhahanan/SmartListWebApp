const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');



router.get('/manageusers', ensureAuthenticated, (req, res, next) => {

  Acct.getAll(function(results){
      res.render('manageUser', {title: 'Admin - Manage Users',
      fullname: req.user.fullname,
      profilepic: req.user.profilepic,
      users: results
      });   
  });
})
module.exports = router;