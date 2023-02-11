const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');



//Get All of the Users
router.get('/manageusers', ensureAuthenticated, (req, res, next) => {

  Acct.getAll(function(results){
      res.render('manageUser', {title: 'Admin - Manage Users',
      fullname: req.user.fullname,
      profilepic: req.user.profilepic,
      users: results
      });   
  });
})

//Get to the Add New Users
router.get('/addUser', ensureAuthenticated, (req, res, next) => {

  Acct.getAll(function(results){
      res.render('addUser', {title: 'Admin - Add New User',
      fullname: req.user.fullname,
      profilepic: req.user.profilepic,
 
      });   
  });
})

// Admin create the New User
router.post('/addUser',ensureAuthenticated, (req,res) => {

  const { fullname, username, email, phonenumber, pw1, address, bio, instituteName, ifAdmin } = req.body;

  if( Acct.ifExists(email) )
  {
      res.render( 'manageUser', {
          error: "User Already Existed With The Email"
      })
  }
  else{
      Acct.create(fullname, username, email, phonenumber, pw1, address, bio, instituteName, ifAdmin);
      req.flash("msg", "Registration of the New User is Successful")
      res.redirect('/admin/manageusers');
  }
  
});




//Delete User
router.post('/deleteUser/:_id', (req, res, next) => {
  
  console.log(req.params._id);
  let id = req.params._id;

  Acct.delete({
		_id : id });

	res.redirect("/admin/manageusers");

});


//Get User By Id
router.get('/viewUser/:_id', ensureAuthenticated,(req, res) =>
{
  console.log(req.params._id);
  let id = ObjectID(req.params._id);


  Acct.getUserById(id, function(results){
   console.log(results)
    res.render('viewUser', {title: 'SmartList - Admin View User',
          id:results.id,
          username: results.username,
          fullname:  results.fullname,
          ifAdmin : results.ifAdmin,
          email :results.email,
          bio: results.bio,
          pw1 :results.pw1,
          address:results.address,
          instituteName:results.instituteName,
          phonenumber:results.phonenumber,
          fullname: req.user.fullname,
           profilepic: req.user.profilepic,
        });
    
  
  })
 // res.send(id);
});

//Update User
router.post('/updateUser/:_id', function(req, res, next) {

    username = req.body.username;
    fullname = req.body.fullname;
    email = req.body.email;
    address = req.body.address;
    instituteName= req.body.instituteName;
    bio = req.body.bio;
    phonenumber = req.body.phonenumber;
   
    console.log(req.params._id);
    let id = ObjectID(req.params._id);
  
    Acct.adminUpdate(id, username, fullname,email,address,instituteName,bio, phonenumber);
    res.redirect("/admin/manageUsers");
  });
  

//Add New User
router.post('/addUser', (req,res) => {

  const { fullname, username, email, phonenumber, pw1, pw2, address, bio, instituteName, ifAdmin } = req.body;

  if( Acct.ifExists(email) )
  {
      res.render( 'manageusers', {
          error: "User Already Existed With The Email"
      })
  }
  else{
      Acct.create(fullname, username, email, phonenumber, pw1, pw2, address, bio, instituteName, ifAdmin);
      req.flash("msg", "Registration of the User is Successful")
      res.redirect('/admin/manageUsers');
  }
  
});

module.exports = router;