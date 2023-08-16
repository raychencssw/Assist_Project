const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const guestcheckinSchema = new Schema({
  email: {
    type: String,
    required: true,
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
  refUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Guestcheckin", guestcheckinSchema);
