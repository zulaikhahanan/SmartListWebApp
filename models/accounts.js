const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
    profilepic: {
        type: String,
        required: true,
        default: "defaultdp.png"
    },
    email: {
        type: String,
        required: true
    },
    pw1: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    phonenumber: {
        type: String
    },
    instituteName: {
        type: String,
    },
    bio: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    ifAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

var Acct = mongoose.model('accounts', schema);

exports.ifExists = function(email){
    Acct.findOne({ email: email})
    .then( exists => {
        if(exists)
            return true;
        else
            return false;
    })
}

exports.create = function(fullname, username, email, phonenumber, pw1, pw2, address, bio,instituteName, ifAdmin)
{
    const newUser = new Acct({
        fullname,
        username,
        email,
        phonenumber,
        pw1,
        address,
        bio,
        instituteName,
        ifAdmin
    });

    bcrypt.genSalt(10, (err, salt) => 
        bcrypt.hash(newUser.pw1, salt, (err, hash) => {
            if(err) throw err;
            // Hashed password
            newUser.pw1 = hash;
            newUser.save()
            .catch(err => console.log(err));
        }))
}

exports.getById = function(id, next){
    Acct.findOne({"_id":id}, (err, results) => {
        if (err) throw err;
        next(results);
    })
}

exports.passport = function(email){

    return Acct.findOne({ email }, (err, results) => {
        if (err) throw err;
    })
}

exports.passportId = function(id, doneParam){

    Acct.findById(id, function(err, user) {
        doneParam(err, user);
    });
}

exports.update = function(id, phonenumber, address, bio, instituteName){

    Acct.updateOne({ "_id" : id }, 
    { "$set" : 
      {"phonenumber" : phonenumber, 
        "address" : address,
        "bio" : bio,
        "instituteName" : instituteName
      }
    }).then( x => {console.log("Update Success")});
}

exports.updatePicture = function(id, picture){
    Acct.updateOne({ "_id" : id }, 
    { "$set" : 
      {"profilepic": picture}
    }).then( x => {console.log("Update Success")});
}

exports.updatePassword = function(id, hash){
    Acct.updateOne({ "_id" : id }, 
    { "$set" : 
      {
        "pw1": hash
      }
    }).then( x => {console.log("Update Success")});
}



exports.getAll = function(next){
    Acct.find({}, (err, users) => {

        if (err) {
            throw err;
        }

        next(users)
    });
}
