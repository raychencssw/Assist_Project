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
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
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
    }
})

module.exports= mongoose.model('Post', postSchema);