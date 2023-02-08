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

//Delete User
router.post('/deleteUser/:_id', (req, res, next) => {
  
  console.log(req.params._id);
  let id = req.params._id;

  Acct.delete({
		_id : id });

	res.redirect("/admin/manageusers");

});
module.exports = router;