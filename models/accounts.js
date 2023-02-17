const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Consists of Profile Pic, Email, Password, Full Name, User Name, Picture, Phone Number, Address, Intitution Name, Bio, IfAdmin

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
    address: {
        type: String,
        required:true
    },
    instituteName: {
        type: String,
    },
    bio: {
        type: String
    },
    ifAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

//Model for Account Is For User of the System Which Are Admin and Student
var Acct = mongoose.model('accounts', schema);


//Function 

//Detect If There Is Same Email In the System
exports.ifExists = function(email){
    Acct.findOne({ email: email})
    .then( exists => {
        if(exists)
            return true;
        else
            return false;
    })
}


//Create the User In the System
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

//Encyrpt the Password that Created by the User
    bcrypt.genSalt(10, (err, salt) => 
        bcrypt.hash(newUser.pw1, salt, (err, hash) => {
            if(err) throw err;
            // Hashed password
            newUser.pw1 = hash;
            newUser.save()
            .catch(err => console.log(err));
        }))
}

//Find the User By Id
exports.getById = function(id, next){
    Acct.findOne({"_id":id}, (err, results) => {
        if (err) throw err;
        next(results);
    })
}

//Export the Email of the User Using the Passport Dependency
exports.passport = function(email){

    return Acct.findOne({ email }, (err, results) => {
        if (err) throw err;
    })
}

//Export the Id of the User Using the Passport Dependency
exports.passportId = function(id, doneParam){

    Acct.findById(id, function(err, user) {
        doneParam(err, user);
    });
}

//Update the Enable Attributes Such As Phone Number, Address, Bio, Institution Name
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

//Update the Profile Picture
exports.updatePicture = function(id, picture){
    Acct.updateOne({ "_id" : id }, 
    { "$set" : 
      {"profilepic": picture}
    }).then( x => {console.log("Update Success")});
}

//Update the Password
exports.updatePassword = function(id, hash){
    Acct.updateOne({ "_id" : id }, 
    { "$set" : 
      {
        "pw1": hash
      }
    }).then( x => {console.log("Update Success")});
}

//Delete the User from the System
exports.delete = function(id){
    Acct.deleteOne({"_id": id}, function(err, result) {
       if (err) throw err;
    })
    console.log("Delete User")
}

//Get All the User In the System
exports.getAll = function(next){
    Acct.find({}, (err, users) => {

        if (err) {
            throw err;
        }

        next(users)
    });
}

//Get the User By The Id
exports.getUserById = function(_id, next){
    Acct.findOne({_id}, (err, results) => {
        if (err)  throw err;
        next(results)
    })
}

//Admin Update The User Details
exports.adminUpdate = function(_id, username, fullname, email,address,instituteName,bio,phonenumber){

    Acct.updateOne({ _id}, 
    { "$set" : 
      {"username" : username, 
        "fullname" : fullname,
        "email" : email,
        "address":address,
        "instituteName":instituteName,
        "bio":bio,
        "phonenumber": phonenumber

        
      }
    }).then( x => {console.log("Update Success")});
}

