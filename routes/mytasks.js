const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');


//Get to Task Page
router.get('/taskPage', ensureAuthenticated, (req, res, next) => {

    const _id = ObjectID(req.session.passport.user);
    
    Acct.getById(_id, function(results){
        
      res.render('tasks', {title: 'My Task',
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

router.post('/createTask', async (req, res) => {

  const _id = ObjectID(req.session.passport.user);

  Acct.getById(_id, function(results){
      
    const { status, title, description, type, date_of_due } = req.body;

      let user = _id;
     

 
      Tasks.create(status, title,description, type,date_of_due,user)
      

      
  })
});





module.exports = router;

















