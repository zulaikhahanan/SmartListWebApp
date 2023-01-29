const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const ObjectId = require('mongodb').ObjectID;
const Acct = require('../models/accounts');
const Tasks = require('../models/tasks');

//Manage Task By The Admin
router.get('/tasks', ensureAuthenticated, (req, res, next) => {
    if (!req.isAuthenticated()) { 
        res.redirect('/');
    }
    const _id = ObjectId(req.session.passport.user);

    Acct.getById(_id, function(results){
      
      Tasks.getAll(function(tasksList){

        var incomplete =tasksList.filter(obj => {
          return obj.status !== "Incomplete";
        })

        var complete = tasksList.filter(obj => {
          return obj.status === "Complete";
        })

        res.render('managetasks', {title: 'Admin - Tasks',
          fullname: results.fullname,
          username: results.username,
          profilepic: results.profilepic,
          incomplete: incomplete,
          complete: complete
        });
      })
    })
})

router.post('/changeStatus', (req, res) =>
{
  let id = ObjectId(req.body.orderNo);
  console.log("ID ", id)
  let stat = req.body.newStatus;

  Tasks.getItemById(id, function(results){
    console.log(results)
    results.status = stat;
    if(stat === "Complete") 
    {
      var d = new Date();

      var month = d.getMonth()+1;
      var day = d.getDate();

      var output = d.getFullYear() + '/' +
          (month<10 ? '0' : '') + month + '/' +
          (day<10 ? '0' : '') + day;
      
      results.date_of_deliver = output;
    }
    results.save();
  })
  res.send(id);
});

module.exports = router;