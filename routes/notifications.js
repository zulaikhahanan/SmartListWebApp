const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get To Notification Page
router.get('/notifications', ensureAuthenticated, (req,res) => {
    
  const _id = ObjectID(req.session.passport.user);

  Acct.getById(_id, function(results){
    
    Tasks.getById(_id, function(taskList){
      console.log(taskList)
      

      var IncompleteAcademic = taskList.filter(obj => {
        return obj.status === "Incomplete" && obj.type === "Academic";
      })

      var CompletedAcademic = taskList.filter(obj => {
        return obj.status == "Completed" && obj.type === "Academic";
      })

      var Incomplete = taskList.filter(obj => {
        return obj.status == "Incomplete";
      })

      var IncompleteNonAcademic = taskList.filter(obj => {
        return obj.type == "Non Academic" && obj.status == "Incomplete";
      })

      var CompletedNonAcademic = taskList.filter(obj => {
        return obj.type == "Non Academic" && obj.status == "Completed";
      })


      var Completed = taskList.filter(obj => {
        return obj.status == "Completed";
      })

      res.render('notifications', {title: 'SmartList - My Notifications',
        username: results.username,
        profilepic: results.profilepic,
        incompletetaskandacademic:IncompleteAcademic,
        completetaskandacademic:CompletedAcademic,
        incompletetaskandnonacademic : IncompleteNonAcademic,
        completetaskandanoncademic : CompletedNonAcademic,
        incompletetask : Incomplete,
        completetask : Completed
      });

   
    })
  })
})


module.exports = router;
