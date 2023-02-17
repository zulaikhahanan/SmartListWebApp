const mongoose = require('mongoose');

//Consists of Status, User, Date of Assigned, Description, Title @ Name,Type, IsReminded, remindAt

const schema = new mongoose.Schema({

    status: {
        type: String,
        required:true
   
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'accounts'
   },

    date_of_assigned: {
        type: Date,
        default: Date.now
    },
    date_of_due: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required:true
    },

    name: {
        type: String,
        required:true
    },

    type: {
        type: String,
        required:true
    },


});

var Tasks = mongoose.model('tasks', schema);


//The User Create Task
exports.create = function(status, date_of_due, description, name, type,user){
    
  const task = new Tasks({
            status,
            date_of_due,
            description,
            name,
            type,
            user,
            
    });
   task.save()
}
 

//Get All of the Tasks
exports.getAll = function(next){
    Tasks.find({}, (err, tasks) => {

        if (err) {
            throw err;
        }

        next(tasks)
    });
}

//Get the Task By User
exports.getByUser = function(id, next){
    Tasks.find({user: id})
    
        .sort({'date_of_assigned': 'desc'})
        .limit(100)
        .exec((err, taskList) => {
        if (err) throw err;
        next(taskList);
    }) 
}

//Get By User Id
exports.getById = function(id, next){
    Tasks.find({user: id})
        .populate('user')
        .exec ((err, results) => {
        if (err)  throw err;
        next(results)
    })
}

//Delete Tasks
exports.delete = function(id){
    Tasks.deleteOne({"_id": id}, function(err, result) {
       if (err) throw err;
    })
    console.log("The Task Already Delete")
}

//Get All of the Tasks
exports.getAll = function(next){
    Tasks.find({}).populate('user').exec((err, taskList) => {
        if (err) throw err;
        next(taskList);
    });
}

//Update Tasks
exports.update = function(id, date_of_due, description, name, type){

    Tasks.updateOne({ "_id" : id }, 
    { "$set" : 
      {"date_of_due" : date_of_due, 
        "description" : description,
        "name" : name,
        "type" : type
      }
    }).then( x => {console.log("Update Success")});
}

//Change Completion Status to Incomplete or Completed
exports.updateStatus = function(id, status){

    Tasks.updateOne({ "_id" : id }, 
    { "$set" : 
      {"status" : status
      }
    }).then( x => {console.log("Update Success")});
}

//Change the Reminder Status 
exports.updateReminder = function(id, isReminded){

    Tasks.updateOne({ "_id" : id }, 
    { "$set" : 
      {true: isReminded
    
      }
    }).then( x => {console.log("Update Success")});
}


//Delete Tasks
exports.delete = function(id){
    Tasks.deleteOne({"_id": id}, function(err, result) {
       if (err) throw err;
    })
    console.log("Delete Task")
}

//Find Task By Id
exports.getItemById = function(_id, next){
    Tasks.findOne({_id}, (err, results) => {
        if (err)  throw err;
        next(results)
    })
}

