'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    date_of_assigned: {
        type: Date,
        required: true,
        default: Date.now
    },
    date_of_due: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
});

var Tasks = mongoose.model('tasks', schema);

exports.create = function(status, user, date_of_assigned, date_of_due, description, title, type){

    let task = new Tasks({
            status,
            user,
            date_of_assigned,
            date_of_due,
            description,
            title,
            type
    });

    

    task.save()
}

exports.getByBuyer = function(id, next){
    Tasks.find({user: id})
        .sort({'date_of_assigned': 'desc'})
        .limit(10)
        .exec((err, tasksList) => {
        if (err) throw err;
        next(tasksList);
    }) 
}

exports.getAll = function(next){
    Tasks.find({}).populate('user').exec((err, tasksList) => {
        if (err) throw err;
        next(tasksList);
    });
}

exports.getById = function(id, next){
    Tasks.find({user: id})
   
        .populate('user')
        .exec ((err, results) => {
        if (err)  throw err;
        next(results)
    })
}

exports.getItemById = function(_id, next){
    Tasks.findOne({_id}, (err, results) => {
        if (err)  throw err;
        next(results)
    })
}
