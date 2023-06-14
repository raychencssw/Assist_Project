const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  profilepicture: {
    type: String,
  },
  role: {
    type: Number,
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
  },
  posts: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  likedposts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  eventsAttended: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],

  points: {
    type: Number,
    default: 0,
  },
});

//Methods
//Generates a hash
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
