const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    author: {
        Type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    title: {
        type: String,
        require: true
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

module.exports= mongoose.model('Post', userSchema);