const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const cors = require("cors")
const ObjectID = require('mongodb').ObjectID;
const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks=require('../models/tasks');
const moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();

 


//Get Task Page
router.get('/mytask', ensureAuthenticated, (req,res) => {
    
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
        res.render('tasks', {title: 'SmartList - My Tasks',
          username: results.username,
          profilepic: results.profilepic,
          incompletetask:Incomplete,
          completetask:Completed
        
        });
      })
  })
})

//Get to Add Task Page
router.get('/addTask', ensureAuthenticated, (req, res, next) => {

    const _id = ObjectID(req.session.passport.user);
    
    Acct.getById(_id, function(results){
        
      res.render('addTask', {title: 'Add Task',
        _id: results._id,
        fullname: results.fullname,
        profilepic: req.user.profilepic,
        username: results.username,
        email: results.email,
        phonenumber: results.phonenumber,
        address: results.address,
        bio: results.bio,
        instituteName: results.instituteName,
        profilepic: results.profilepic
      })
  })
})

//Create Task
router.post('/createTask',async (req, res, next) => {

      const _id= ObjectID(req.session.passport.user);
      let user=_id;
      let status = "Incomplete";
      var date_of_due = req.body.date_of_due;
      var description = req.body.description;
      var name= req.body.name;
      var type = req.body.type;
      Tasks.create(status,date_of_due, description,name,type,user);
      res.redirect('/mytask');

       //Send Notification to the User After Task Created

       const msg = ' Upcoming Task Due Date On '+req.body.date_of_due + ' For Task Named '+req.body.name;

       const accountSid = process.env.ACCOUNT_SID 
       const authToken = process.env.AUTH_TOKEN
       const client = require('twilio')(accountSid, authToken);
        client.messages 
       .create({ 
         body:msg, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+60146669736' 
      }) 
        .then(message => console.log(message.sid)) ;
});
 

//Update Task
router.post('/updateTask', function(req, res, next) {

  date_of_due = req.body.date_of_due;
  description = req.body.description;
  name = req.body.name;
  type = req.body.type;
  var id=req.body.id;
 
  Tasks.update(id, date_of_due, description, name, type);
  res.redirect('/mytask');
});


//Delete Task
router.post('/deleteTask/:_id', (req, res, next) => {
  
  console.log(req.params._id);
  let id = req.params._id;

  Tasks.delete({
		_id : id });

	res.redirect("/mytask");

});

// Get to View Task Details
router.get('/viewTask/:_id', ensureAuthenticated,(req, res) =>
{
  console.log(req.params._id);
  let id = ObjectId(req.params._id);


  Tasks.getItemById(id, function(results){
   // console.log(results)
    res.render('viewTask', {title: 'SmartList - View My Task',
          id:results.id,
          name: results.name,
          type:  results.type,
          description : results.description,
          date_of_due : results.date_of_due,
          date_of_assigned : results.date_of_assigned,
          username:results.user.username,
          user:results.user,
          status : results.status,
          username: req.user.username,
          profilepic: req.user.profilepic,
          profilepic: results.profilepic
        });
   })
 });


//Change Status to Complete
router.post('/changeStatusComplete/:_id', function(req, res, next) {
  console.log(req.params._id);
  let id = ObjectId(req.params._id);
  let status = "Completed";
 
  Tasks.updateStatus(id, status);
  res.redirect('/mytask');
});

//Change Status to Incomplete
router.post('/changeStatusIncomplete/:_id', function(req, res, next) {
  console.log(req.params._id);
  let id = ObjectId(req.params._id);
  let status = "Incomplete";
 
  Tasks.updateStatus(id, status);
  res.redirect('/mytask');
});

//Whatsapp Message Reminder
module.exports = router;






