const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        //required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time: {
        hour:{
            type:Number,
            required: true
        },
        minute:{
            type:Number,
            required: true
        }
    },
    location:{
        street: {
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
    },
    coordinates:{
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

module.exports= mongoose.model('Event', eventSchema);