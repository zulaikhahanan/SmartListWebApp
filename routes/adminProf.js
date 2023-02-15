const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const ObjectID = require('mongodb').ObjectID;
const Acct = require('../models/accounts');

const multer = require('multer');

const dpstrategy = multer.diskStorage({
  destination: function (req, file, cb)
  {
      cb(null, './assets/profilepictures/')
  },
  filename: function (req, file, cb)
  {
      cb(null, file.originalname)
  }
})

const fileFilter = function (req, file, cb)
{
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb (null, true);
  else cb (null, false);
}

const dpupload = multer({storage: dpstrategy, fileFilter: fileFilter});

router.get('/profile', ensureAuthenticated, (req, res, next) => {

    const _id = ObjectID(req.session.passport.user);
    
    Acct.getById(_id, function(results){
        
      res.render('adminprofile', {title: 'SmartList- Admin Profile',
         _id: results._id,
        fullname: results.fullname,
        profilepic: req.user.profilepic,
        username: results.username,
        email: results.email,
        phonenumber: results.phonenumber,
        address: results.address,
        instituteName: results.instituteName,
        bio: results.bio,
        profilepic: results.profilepic
      })
  })
})

//Admin Profile
router.post('/profilepicture', dpupload.single('profilePic') ,function(req, res, next) {

  const _id = ObjectID(req.session.passport.user);
  const picture = req.file.filename;
  Acct.updatePicture(_id, picture);
  res.redirect('/admin/profile');
});

//Change Password
router.post('/changepassword' ,function(req, res, next) {

  const _id = ObjectID(req.session.passport.user);
  
  if(req.body.ps1 == req.body.ps2)
  {
    bcrypt.genSalt(10, (err, salt) => 
      bcrypt.hash(req.body.ps1, salt, (err, hash) => {
        if(err) throw err;
        Acct.updatePassword(_id, hash)
        res.redirect('/admin/profile');
    }))
  }
});

module.exports = router;