const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkinSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
    },
      eventId: {
        type: ObjectId,
        ref: 'Event',
    },
      checkInTime: {
        type: Date,
        default: Date.now,
    },
      checkOutTime: {
        type: Date,
        default: null,
    },
})