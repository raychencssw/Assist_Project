const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
initializePassport(passport);
//const flash = require("express-flash");
const session = require("express-session");
// const ngeohash = require('ngeohash')

const posts = [];

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(
  session({
    secret: "random secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

let db_url =
  "mongodb+srv://jitbaner:4r17oq9ZuznScSih@cluster0.znvt1pl.mongodb.net/AssistProject?retryWrites=true&w=majority";

mongoose
  .connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("CONNECTION OPEN");
  })
  .catch((e) => {
    console.log("Error!");
    console.log(e);
  });

app.post("/posts/submit", (req, res) => {
  const data = req.body.post;
  posts.push(data);
  console.log(posts);

  res.json({ success: true, message: "Data received" });
});

// app.get('/signup', async (req, res)=>{
//     const user = new User({id: 1, username: 'test', email: 'test@test.com', firstname: 'testFirst', lastname: 'testLast', role: 1, points: 14})
//     await user.save()
//     res.send(user)
// })

app.post("/signup", async (req, res) => {
  // Jack should work here. Receive the userdata and store it in the "User" collection.

  try {
    const {
      username,
      email,
      firstname,
      lastname,
      profilepicture,
      role,
      school,
    } = req.body;

    //Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    //Check if email already exists
    //Check if username already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = new User({
      username,
      email,
      firstname,
      lastname,
      profilepicture,
      role,
    });
    newUser.password = newUser.generateHash(req.body.password);
    await newUser.save();
    console.log("user saved");
    res.redirect("/login");
  } catch (error) {
    console.error("Error signing up: ", error);
    res.redirect("/signup");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/home", (req, res) => {
  res.send({ posts: posts });
});

app.get("/qrscan", (req, res) => {
  res.send("HERE WE WILL HAVE QR SCANNER");
});

app.get("/eventdetails/:eventid", (req, res) => {
  res.send("HERE WE HAVE EVENT DETAILS");
});

app.post("/createevent", (req, res) => {
  res.send("THIS IS NEW EVENT POST");
});

app.get("/profle/:userid", (req, res) => {
  res.send("HERE IS MY PROFILE");
});

app.get("/rankings", (req, res) => {
  res.send("THIS IS RANKINGS");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login ");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

const port = process.env.PORT || 3080;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
