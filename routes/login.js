const express = require('express');
const router = express.Router();
const passport = require('passport');
const {forwardAuthenticated } = require('../config/auth');

// Use Main Layout for Non-admins
router.all('/*', function (req, res, next) {
    req.app.locals.layout = 'main';
    next();
});

// Use Admin Layout for Admins
router.all('/admin*', function (req, res, next) {
    req.app.locals.layout = 'admin';
    next(); // pass control to the next handler
});

//Get The Login Page
router.get('/', forwardAuthenticated, (req,res) => {
    res.render('login', {title: 'Login', layout: 'landing'})
})

//Login Into The System
router.post('/', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/',
    failureFlash: true
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('msg', 'User Already Logged out');
    res.redirect('/');
});

module.exports = router;