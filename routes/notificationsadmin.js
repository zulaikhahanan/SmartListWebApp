const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get To  Admin Notification Page
router.get('/notificationsadmin', ensureAuthenticated, (req,res) => {
    
  const _id = ObjectID(req.session.passport.user);

  Acct.getById(_id, function(results){
    Tasks.getAll(function(taskList){
      console.log(taskList)
      

      var IncompleteAcademic = taskList.filter(obj => {
        return obj.status === "Incomplete" && obj.type === "Academic";
      })

      var CompletedAcademic = taskList.filter(obj => {
        return obj.status == "Completed" && obj.type === "Academic";
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

      var Incomplete = taskList.filter(obj => {
        return obj.status == "Incomplete";
      })

      res.render('notificationsadmin', {title: 'SmartList - Admin Notifications',
        username: results.username,
        fullname: results.fullname,
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
