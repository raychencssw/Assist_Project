const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const Post = require("./models/post");
const School = require("./models/school");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
//const flash = require("express-flash");
const session = require("express-session");
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('./config')
const verifyToken = require('./verifyToken')
// const ngeohash = require('ngeohash')
const Joi = require('joi');
const schemas = require('./schemas');
const middleware = require('./middleware');
const { async } = require('rxjs');



const db = mongoose.connection;
//const passport = require("passport");
//const initializePassport = require("./passport-config");
//initializePassport(passport);
// const ngeohash = require('ngeohash')

const multer = require("multer");
const { storage } = require("../cloudinary");
const { cloudinary } = require("../cloudinary");

// creating variables
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let randomId = "";
let posts = [];

const upload = multer({ storage: storage });

initializePassport(passport);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
app.use(bodyParser.json({ limit: "25mb" }));
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

app.get('/home/:page', verifyToken, async (req, res) => {
  page = req.params.page
  const limit = 5
  const allPosts = await Post.find({}).populate([{ path: 'author', select: ' _id username firstname lastname profilepicture' }]).skip((page - 1) * limit).limit(limit)
  const postObjects = allPosts.map(post => {
    return {
      id: post._id,
      userid: post.author._id,
      username: post.author.username,
      firstname: post.author.firstname,
      lastname: post.author.lastname,
      userprofilepic: post.author.profilepicture,
      location: post.location,
      date: post.date,
      description: post.description,
      likes: post.likes,
      imageurl: post.imageurl
    };
  });
  console.log(postObjects)
  res.send({ posts: postObjects })
})


app.post('/posts/submit/:userid', verifyToken, upload.single('photo'), middleware(schemas.postPOST), async (req, res) => {
  console.log(req.body)
  foundUser = await User.findById(req.params.userid);

  // generating id
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }
  const currentDate = Date.now();
  const post = new Post({
    id: randomId,
    author: foundUser,
    description: req.body.description,
    date: currentDate,
    location: req.body.location,
    likes: 0,
    imageurl: req.file.path

  })
  await post.save()
  foundUser.posts.push(post)
  res.json({ success: true, message: "Data received" })


})


app.get("/home/:page/:userId?", verifyToken, async (req, res) => {
  console.log("Receive call to get posts");
  page = req.params.page;
  let userId = req.params.userId;
  let query = {};
  if (userId !== undefined) {
    console.log("Get post for this user: " + userId);
    query = { author: userId };
  }
  const limit = 5;
  const allPosts = await Post.find(query)
    .populate("author", "username")
    .skip((page - 1) * limit)
    .limit(limit);
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


app.post('/posts/togglelike', async (req, res) => {

  const user = await User.findById(req.body.userid)
  const post = await Post.findById(req.body.postid)
  // console.log(user, post)
  if (req.body.addtoLike) {
    user.likedposts.push(post._id)
    const like = post.likes + 1
    post.likes = like
  } else {
    user.likedposts = user.likedposts.filter(postId => {
      postId != req.body.postid
    })
    if (post.likes > 0) {
      const like = post.likes - 1
      post.likes = like
    }
  }
  await user.save()
  await post.save()
  console.log("HEREEEEE")
  console.log(user, post)
  return res.status(201).json({ message: "Like toggled" });
})


app.post("/signup", upload.single("profilePicture"), middleware(schemas.signupPost), async (req, res) => {
  // Jack should work here. Receive the userdata and store it in the "User" collection.


  //check if a file uploaded. if no profilepicture uploaded, gave a default user picture
  if (req.file) {
    var profilePicture = req.file.path;
  }
  else {
    var profilePicture = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';
  }


  try {
    const { username, email, firstname, lastname, school } = req.body;

    //Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("username already exists");
      return res.status(409).json({ message: "Username already exists" });
    }

    //Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("email already exists");
      return res.status(409).json({ message: "Email already exists" });
    }

    //Find school id from school name
    const schoolDocument = await School.findOne({ name: school });
    const schoolID = schoolDocument._id;

    const newUser = new User({
      username,
      email,
      firstname,
      lastname,
      profilePicture,
      schoolID,
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

app.post("/login", passport.authenticate("local"), middleware(schemas.loginPost), function (req, res) {
  console.log("requser", req.user)
  console.log("requser", req.body)
  const token = jwt.sign({ id: req.user._id }, config.secretKey, {
    expiresIn: config.expiresIn,
  });
  console.log(token);
  res.json({
    token: token,
    user: req.user,
  });
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "logged out" });
  });
});


app.get("/qrscan", (req, res) => {
  res.send("HERE WE WILL HAVE QR SCANNER");
});




app.get('/profile/:userid', async (req, res) => {
  console.log(req.params.userid)
  const user = await User.findById(req.params.userid)
  res.send(user)
})

app.get('/profile/school/:userid', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.userid).populate('schoolID');

  if (user && user.schoolID) {
    const school = await School.findById(user.schoolID);
    if (school) {
      const schoolName = school.name;
      res.send({ 'School': schoolName })
      // You can use schoolName as needed
    }
  }

})

app.post('/profileedit/:userid', upload.single("profilepicture"), middleware(schemas.profilePOST), async (req, res) => { // 
  const updatedData = req.body;
  console.log("Profile will change to", updatedData)
  const check_file = req.file;

  //find school id by school name
  const schoolDocument = await School.findOne({ name: req.body.school });
  const schoolID = schoolDocument._id;

  const user = await User.findById(req.params.userid)
  user.username = req.body.username,
    user.schoolID = schoolID,
    user.firstname = req.body.firstname,
    user.lastname = req.body.lastname,
    user.email = req.body.email
  if (check_file) {
    user.profilepicture = req.file.path
  }
  await user.save()
  res.status(201).json({ message: "profile updated created" });
})

app.get("/eventsearch", (req, res) => {
  const getEvents = Event.distinct('name')//.toArray()//OBJECT
  getEvents.then(function (result) {
    res.json(result)
  })
});

app.get("/usersearch", (req, res) => {
  const getEvents = User.distinct('username')//.toArray()//OBJECT
  getEvents.then(function (result) {
    res.json(result)
  })
});

app.post('/createevent', middleware(schemas.eventPOST), async (req, res) => {
  //can't access DB, need debug
  console.log("req.body: " + JSON.stringify(req.body)); //{"Name":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
  console.log("req.body.Name: " + req.body.name); //Great event

  //extract every property from req.body and store them to the variable defined inside const{ }
  //these variables can later be used directly. Warning: these variables have to be exactly the same
  //as in the eventForm, or it'll become undefined.
  const {
    name,
    date,
    time: {
      hour,
      minute,
    },
    location: {
      street,
      city,
      state,
    },
    description,
  } = req.body;

  // const imageurl = req.file.path;
  // console.log("incoming imageurl: " + imageurl);

  //Check if username already exists, need check later for other mechanism???
  const existingUser = await Event.findOne({ name });
  if (existingUser) {
    return res.status(409).json({ message: "Eventname already exists" });
  }

  // generating id
  var id = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  console.log("new event ")

  const newEvent = new Event({
    id,
    name,
    // imageurl,
    date,
    time: {
      hour,
      minute,
    },
    location: {
      street,
      city,
      state,
    },
    description,
  });
  console.log("newEvent: " + newEvent);
  await newEvent.save();
  console.log("a new Event is sent to backend successfully!");
  res.status(201).json({ message: "Event created" });
})

app.get("/events", verifyToken, async (req, res) => {
  //await Event.deleteMany({});   //uncomment this line of code only when you want to delete all the document in the DB
  const events = await Event.find();
  console.log("events: " + events);
  res.send(events);
});


app.get("/event/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  console.log("eventID: " + eventId);
  try {
    // Find the event by eventId
    // const event = await Event.findOne({ _id: eventId })
    const event = await Event.findOne({ id: eventId });

    if (event) {
      res.send(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Error retrieving event: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/following', verifyToken, async (req, res) => {
  const user = await User.findOne({ id: 1 })
  const follow = await user.populate([
    { path: "following", select: "username firstname lastname" },
  ]);
  console.log(follow)
  res.send({ following: follow.following });
});

app.get('/following/:userid', verifyToken, async (req, res) => {
  const user = await User.findById(req.params.userid)
  res.send(user);
});


app.post('/follow/:myid/:userid/:isfollowing', async (req, res) => {
  const isfollowing = req.params.isfollowing;
  const myid = req.params.myid;
  const userid = req.params.userid;


  if (isfollowing == "true") {
    //append myid to user's follower
    const user = await User.findById(userid)
    user.followers.push(myid)
    // append userid to my following list
    const myuser = await User.findById(myid)
    myuser.following.push(userid)
    await user.save()
    await myuser.save()
    res.status(201).json({ message: "follow updated" })
  }

  else {
    //pop out myid from user's follower
    const user = await User.findById(userid)
    user.followers.pull(myid);

    // append userid to my following list
    const myuser = await User.findById(myid)
    myuser.following.pull(userid)
    await user.save()
    await myuser.save()
    res.status(201).json({ message: "unfollow updated" })
  }


})


app.get("/searchuser/:username", async (req, res) => {
  // Retrieve user with the specified ID from the data source
  const username = req.params.username;
  const user = await User.findOne({ username: username }); //promise
  if (user) {
    res.json(user);
  } else {
    res.status(500).json({ message: "No such user" });
  }
});

app.get("/searchevent/:name", async (req, res) => {
  // Retrieve user with the specified ID from the data source
  const eventname = req.params.name;
  const events = await Event.findOne({ name: eventname }); //promise
  if (events) {
    res.json(events);
  } else {
    res.status(500).json({ message: "No such event" });
  }
});

app.get("/ranking/student", async (req, res) => {
  try {
    // Retrieve the top 10 users with the most points
    const topUsers = await User.find().sort({ points: -1 }).limit(10);
    // Send the top users as a JSON response
    res.json(topUsers);
  } catch (error) {
    console.log("Error retrieving top users", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the top users" });
  }
});

app.get("/ranking/school", async (req, res) => {
  try {
    // Retrieve the top 10 users with the most points
    const topSchools = await School.find().sort({ points: -1 }).limit(10);
    // Send the top users as a JSON response
    res.json(topSchools);
  } catch (error) {
    console.log("Error retrieving top schools", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the top schools" });
  }
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
