const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');
const accountSid = 'ACbff67be10197906a42ab3309a1a886ee'; 
const authToken = 'b95e8813f28648830a563b5edd066fa2';
const client = require('twilio')(accountSid, authToken); 


//Get To Notification Page
router.get('/notifications', ensureAuthenticated, (req,res) => {
    
  const _id = ObjectID(req.session.passport.user);

  Acct.getById(_id, function(results){
    
      Tasks.getById(_id, function(taskList){
        console.log(taskList)
        var Completed = taskList.filter(obj => {
          return obj.status !== "Incomplete";
        })

        var Incomplete = taskList.filter(obj => {
          return obj.status === "Incomplete";
        })
        res.render('notifications', {title: 'SmartList - My Notifications',
          username: results.username,
          profilepic: results.profilepic,
          incompletetask:Incomplete,
          completetask:Completed
        
        });

        
      })
  })
})



module.exports = router;
