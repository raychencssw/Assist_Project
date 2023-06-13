const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const Post = require("./models/post");
const multer = require("multer");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
//const flash = require("express-flash");
const session = require("express-session");
// const ngeohash = require('ngeohash')
const { storage } = require("../cloudinary");
const { cloudinary } = require("../cloudinary");
const db = mongoose.connection;

// creating variables
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let randomId = "";
let posts = [];

const upload = multer({ storage: storage });
initializePassport(passport);

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

// ROUTES

app.get("/home", async (req, res) => {
  const allPosts = await Post.find({}).populate("author", "username"); //.populate('author', 'firstname')
  const postObjects = allPosts.map((post) => {
    return {
      id: post.id,
      author: post.author.username,
      location: post.location,
      date: post.date,
      time: post.time,
      description: post.description,
      likes: post.likes,
      imageurl: post.imageurl,
    };
  });
  console.log(postObjects);
  res.send({ posts: postObjects });
});

app.post("/posts/submit", upload.single("photo"), async (req, res) => {
  // const data = req.body.post
  // posts.push(data)
  // console.log(posts)
  console.log(req.body, req.file);
  // this needs to be changed after authentication
  foundUser = await User.findOne({ id: 1 });

  // getting todays date and time
  const today = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  let hours = today.getHours();
  let minutes = today.getMinutes();
  minutes = String(minutes).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  console.log(formattedDate, formattedTime);

  // generating id
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  const post = new Post({
    id: randomId,
    author: foundUser,
    date: formattedDate,
    time: formattedTime,
    description: req.body.description,
    location: req.body.location,
    likes: 0,
    imageurl: req.file.path,
  });
  await post.save();
  foundUser.posts.push(post);
  res.json({ success: true, message: "Data received" });
});

// app.get('/signup', async (req, res)=>{
//     const user = new User({id: 1, username: 'test', email: 'test@test.com', firstname: 'testFirst', lastname: 'testLast', role: 1, points: 14})
//     await user.save()
//     res.send(user)
// })

app.post("/signup", async (req, res) => {
  // Jack should work here. Receive the userdata and store it in the "User" collection.
  console.log("receive signup notification");
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
      console.log("username already exists");
      return res.status(409).json({ message: "Username already exists" });
    }

    //Check if email already exists
    //Check if username already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("email already exists");
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
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error signing up: ", error);
    res.redirect("/signup");
  }
});

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

app.post("/login", passport.authenticate("local"), function (req, res) {
  res.json(req.user);
});

app.get("/home", (req, res) => {
  res.send({ posts: posts });
});

app.get("/qrscan", (req, res) => {
  res.send("HERE WE WILL HAVE QR SCANNER");
});

app.get("/profile/:userid", (req, res) => {
  // Retrieve user with the specified ID from the data source
  const userid = req.params.userid;
  const getUser = db.collection("users").findOne({ id: Number(userid) }); //promise
  getUser.then(function (result) {
    res.json(result);
    console.log("user_info", result);
  });
});

app.get("/eventdetails/:eventid", (req, res) => {
  res.send("HERE WE HAVE EVENT DETAILS");
});

app.post("/createevent", async (req, res) => {
  //can't access DB, need debug
  console.log("req.body: " + JSON.stringify(req.body)); //{"Name":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
  console.log("req.body.Name: " + req.body.Name); //Great event

  //extract every property from req.body and store them to the variable defined inside const{ }
  //these variables can later be used directly. Warning: these variables have to be exactly the same
  //as in the eventForm, or it'll become undefined.
  const { name, date, time, location, description } = req.body;

  console.log("name: " + name);
  console.log("date: " + date);
  console.log("time: " + time);
  console.log("location: " + location);
  console.log("description: " + description);

  //Check if username already exists
  const existingUser = await Event.findOne({ name });
  if (existingUser) {
    return res.status(409).json({ message: "Eventname already exists" });
  }

  const newEvent = new Event({
    name,
    date,
    time,
    location,
    description,
  });
  console.log("newEvent: " + newEvent);
  await newEvent.save();
  console.log("a new Event is sent to backend successfully!");
  res.status(201).json({ message: "Event created" });
});

app.get("/rankings", (req, res) => {
  res.send("THIS IS RANKINGS");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ statusCode: 400, message: "not authenticated" });
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.use((req, res) => {
  res.status(404).send("404 PAGE NOT FOUND");
});

const port = process.env.PORT || 3080;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
