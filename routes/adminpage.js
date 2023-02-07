const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');

//Manage Task By The Admin
router.get('/account', ensureAuthenticated, (req, res, next) => {
    if (!req.isAuthenticated()) { 
        res.redirect('/');
    }
    const _id = ObjectId(req.session.passport.user);

    Acct.getById(_id, function(results){
      
        res.render('adminpage', {title: 'SmartList - Admin Account',
          fullname: results.fullname,
          username: results.username,
          profilepic: results.profilepic,
       
        });
      
    })
})


module.exports = router;