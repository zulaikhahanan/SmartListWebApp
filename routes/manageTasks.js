const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');



router.get('/managetasks', ensureAuthenticated, (req, res, next) => {

  Tasks.getAll(function(results){
      res.render('manageTask', {title: 'Admin - Manage Tasks',
      fullname: req.user.fullname,
      profilepic: req.user.profilepic,
      tasks: results
      });   
  });
})
module.exports = router;