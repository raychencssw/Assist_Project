const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('express-joi')
const eventSchema = new Schema({
    id: {
        type: Number,
        //required: true
    },
<<<<<<< HEAD
    name:{
        //type: Number,
        type: String,
=======
    name: {
        type: Number,
>>>>>>> origin/ChengShi
        required: true
    },
    description: {
        type: String,
        required: true
    },
<<<<<<< HEAD
    date:{
        //type: Date,
        type:String,
=======
    date: {
        type: Date,
>>>>>>> origin/ChengShi
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        street: {
            type: String,
            //required: true
        },
        city: {
            type: String,
            //required: true
        },
        state: {
            type: String,
            //required: true
        },
    },
    coordinates: {
        latitude: {
            type: Number,
            //required: true
        },
        longitude: {
            type: Number,
            //required: true
        }
    },
    isApproved: {
        type: Boolean,
        //required: true
    },
    attendants: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

<<<<<<< HEAD
module.exports= mongoose.model('Event', eventSchema);
=======
module.exports = mongoose.model('Event', userSchema);
>>>>>>> origin/ChengShi
