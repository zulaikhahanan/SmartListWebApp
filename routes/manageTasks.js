const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get to Manage Task Page
router.get('/managetasks', ensureAuthenticated, (req, res, next) => {

  Tasks.getAll(function(results){
      res.render('manageTask', {title: 'SmartList Admin - Manage Tasks',
      fullname: req.user.fullname,
      username: req.user.username,
      profilepic: req.user.profilepic,
      tasks: results
      });   
  });
})

//Delete Task
router.post('/deleteTask/:_id', (req, res, next) => {
  
  console.log(req.params._id);
  let id = req.params._id;

  Tasks.delete({
		_id : id });

	res.redirect("/admin/managetasks");

});

//View Task Details By Id
router.get('/viewTask/:_id', ensureAuthenticated,(req, res) =>
{
  console.log(req.params._id);
  let id = ObjectID(req.params._id);


  Tasks.getItemById(id, function(results){
    console.log(results)
    res.render('viewTaskAdmin', {title: 'SmartList Admin - View Task',
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
        profilepic: results.profilepic,
        fullname :req.user.fullname,
        remindAt:results.remindAt
        });
    
  
  })
});

// Admin Change Status to Completed
router.post('/changeStatusCompleted/:_id', function(req, res, next) {
  console.log(req.params._id);
  let id = ObjectID(req.params._id);
  let status = "Completed";
 
  Tasks.updateStatus(id, status);
  res.redirect('/admin/managetasks');
});

//Admin Change Status to Incompleted
router.post('/changeStatusIncomplete/:_id', function(req, res, next) {
  console.log(req.params._id);
  let id = ObjectID(req.params._id);
  let status = "Incomplete";
 
  Tasks.updateStatus(id, status);
  res.redirect('/admin/managetasks');
});

module.exports = router;