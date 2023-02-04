const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require("mongoose");
const moment = require('moment');

const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts')
const Tasks = require('../models/tasks')


//Access To The Profile
//There Are Two Type of Role Either User or Admin
router.get('/account', ensureAuthenticated, (req,res) => {
    
    const _id = ObjectID(req.session.passport.user);
    
    Acct.getById(_id, function(results){
        
        if(results.ifAdmin){
            return res.redirect('/admin/tasks');
        }
        else{
            
           
                    res.render('account', 
                    {
                        title: 'SmartList',
                        username: results.username,
                        fullname: results.fullname,
                        profilepic: results.profilepic,
                        
                    })
  
        }
    })
})

module.exports = router;
