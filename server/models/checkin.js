const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checkinSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
  eventEndTime: {
    type: Date,
    default: null,
  },
  mood: {
    type: String,
    enum: ["happy", "disappointed", "mixed", null],
    default: null,
  },
});

module.exports = mongoose.model("Checkin", checkinSchema);
