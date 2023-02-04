

const mongoose = require('mongoose');

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
        type: String
    },
    title: {
        type: String
    },
    type: {
        type: String
    }
});

var Tasks = mongoose.model('tasks', schema);


//The User Create Task
exports.create = function(status, date_of_due, description, title, type,user){
    
  const task = new Tasks({
            status,
            date_of_due,
            description,
            title,
            type,
            user
    });
   task.save()
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