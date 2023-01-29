const express = require('express');
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');

const Acct = require('../models/accounts')


//Get The Register Page
router.get('/register', forwardAuthenticated, (req,res) => {
    res.render('register', {title: 'Register', layout: 'landing'})
})

//Register The New User
router.post('/register', (req,res) => {

    const { fullname, username, email, phonenumber, pw1, pw2, address, bio, instituteName, ifAdmin } = req.body;

    if( Acct.ifExists(email) )
    {
        res.render( 'register', {
            error: "User Already Existed With The Email"
        })
    }
    else{
        Acct.create(fullname, username, email, phonenumber, pw1, pw2, address, bio, instituteName, ifAdmin);
        req.flash("msg", "Registration Successful")
        res.redirect('/');
    }
    
});

module.exports = router;