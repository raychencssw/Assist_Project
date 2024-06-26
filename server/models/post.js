const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    },
    // likedBy: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
    likedBy:[{
        id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }]
})

module.exports= mongoose.model('Post', postSchema);