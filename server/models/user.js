const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    profilepicture: {
        type: String
    },
    role: {
        type: Number,
        required: true
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School'
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    likedposts: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    eventsAttended: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },

    points: {
        type: Number
    }
})
module.exports = mongoose.model('User', userSchema);