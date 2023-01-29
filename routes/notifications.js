const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get To Task Page

  router.get('/notifications', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);

    Acct.getById(_id, function(results){
      
          res.render('notifications', {title: ' My Notification',
            fullname: results.fullname,
            username:results.username,
            profilepic: results.profilepic,
            tasksList :results.tasksList
       
          });
    
    })
})




module.exports = router;
