const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get to Manage Task Page
router.get('/managetasks', ensureAuthenticated, (req, res, next) => {

  Tasks.getAll(function(results){
      res.render('manageTask', {title: 'Admin - Manage Tasks',
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
    res.render('viewTask', {title: 'SmartList - Update My Task',
        id:results.id,
        title: results.title,
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
        fullname :req.user.fullname
            
        });
    
  
  })
 // res.send(id);
});


module.exports = router;