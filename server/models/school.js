const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    points: {
        type: Number
    }
})
module.exports = mongoose.model('School', schoolSchema)