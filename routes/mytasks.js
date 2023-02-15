const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks=require('../models/tasks');
//const accountSid = 'ACbff67be10197906a42ab3309a1a886ee'; 
//const authToken = 'b95e8813f28648830a563b5edd066fa2'; 
//const client = require('twilio')(accountSid, authToken); 


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

      const msg = 'You Have Task Named '+ req.body.name +' With Upcoming Due Date On ' + req.body.date_of_due;
    
    //client.messages.create({
     // from: 'whatsapp:+14155238886',
     //to: 'whatsapp:+60146669736',
     //body: msg
  // });

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



module.exports = router;






