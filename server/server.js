const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const Post = require("./models/post");
const School = require("./models/school");
const multer = require("multer");
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
const { storage } = require('../cloudinary')
const { cloudinary } = require('../cloudinary');
const Joi = require('joi');
const schemas = require('./schemas');
const middleware = require('./middleware');
const { async } = require('rxjs');



const db = mongoose.connection;
//const passport = require("passport");
//const initializePassport = require("./passport-config");
//initializePassport(passport);
// const ngeohash = require('ngeohash')


// creating variables
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let randomId = "";
let posts = [];

const upload = multer({ storage: storage });

initializePassport(passport);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));
app.use(bodyParser.json({limit: '25mb'}));
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

app.get('/home/:page', verifyToken,  async(req, res) => {
    page = req.params.page
    const limit = 5
    const allPosts = await Post.find({}).populate('author', 'username').skip((page-1) * limit).limit(limit)
    const postObjects = allPosts.map(post => {
        return {
          id: post._id,
          author: post.author.username,
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

app.post('/posts/submit', verifyToken, upload.single('photo'), async(req, res) => {
    // this needs to be changed after authentication
    console.log(req.body)
    foundUser = await User.findOne({id: 1});

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
app.post('/posts/togglelike', async (req, res)=>{

  const user = await User.findById(req.body.userid)
  const post = await Post.findById(req.body.postid)
  console.log(user, post)
  if(req.body.addtoLike){
    user.likedposts.push(post._id)
    const like = post.likes + 1
    post.likes = like
  }else{
    user.likedposts = user.likedposts.map(post=>{
      if(post != req.body.postid){
        return post
      }
    })
    if(post.likes > 0){
      const like = post.likes - 1
      post.likes = like
    }
  }
  await user.save()
  await post.save()
  console.log(user, post)
})


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
  const token = jwt.sign({ id: req.user._id }, config.secretKey, { expiresIn: config.expiresIn });
  console.log(token)
  res.json({
    token: token,
    user: req.user
  });
});

app.get('/logout', (req, res)=>{
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.json({message: 'logged out'});
  });
})

// app.get("/home", (req, res) => {
//   res.send({ posts: posts });
// });

app.get("/qrscan", (req, res) => {
  res.send("HERE WE WILL HAVE QR SCANNER");
});





app.get('/profile/:userid', verifyToken, async (req, res) => {
    // Retrieve user with the specified ID from the data source
    // const userid = req.params.userid;
    // const getUser = db.collection('users').findOne({ id: Number(userid) })//promise
    // getUser.then(function (result) {
    //     res.json(result)
    //     console.log('user_info', result);
    // })
    console.log(req.params.userid)
    const user = await User.findById(req.params.userid)
    res.send(user)
})

// app.get("/eventdetails/:eventid", (req, res) => {
//   res.send("HERE WE HAVE EVENT DETAILS");
// });

app.post('/profileedit/:userid', upload.single("profilepicture"), (req, res) => { // 
  const updatedData = req.body;
  const check_file = req.file;
  console.log("check_file ", check_file)
  const userid = req.params.userid;
  const useridfound = db.collection('users').findOne({ id: Number(userid) }) //check if we could find the user id data
  const id_filter = { id: Number(userid) };

  if (useridfound) { // if there is a user
    if (!check_file) {
      const updateData = { // no profilepicture: profilepicture,
        username: updatedData.username,
        school: updatedData.school,
        firstname: updatedData.firstname,
        lastname: updatedData.lastname,
        email: updatedData.email
      }
      const update = { $set: updateData };
      console.log("there is no picture")

      const getUser = db.collection('users').updateOne(id_filter, update).then(
        console.log("Successfully updated")
      ).catch(error => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the document' });
      });
    }

    else {
      const profilepicture = req.file.path;
      const updateData = {
        profilepicture: profilepicture,
        username: updatedData.username,
        school: updatedData.school,
        firstname: updatedData.firstname,
        lastname: updatedData.lastname,
        email: updatedData.email
      }
      const update = { $set: updateData };
      console.log("there is a new picture")
      const getUser = db.collection('users').updateOne(id_filter, update).then(
        console.log("Successfully updated")
      ).catch(error => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the document' });
      });

    }

  } else {
    console.error('User not found');
  }
}


)

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

app.post('/createevent', async (req, res) => {
  //can't access DB, need debug
  console.log("req.body: " + JSON.stringify(req.body)); //{"Name":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
  console.log("req.body.Name: " + req.body.Name); //Great event

  //extract every property from req.body and store them to the variable defined inside const{ }
  //these variables can later be used directly. Warning: these variables have to be exactly the same
  //as in the eventForm, or it'll become undefined.
  const {
    name,
    date,
    time,
    location,
    description,
  } = req.body;

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
})

app.get("/events", async (req, res) => {
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
    const event = await Event.findOne({ _id: eventId });

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

app.get('/following', verifyToken, async(req, res)=>{
  const user = await User.findOne({id: 1})
  const follow = await user.populate([
    {path: 'following', select: 'username firstname lastname'},
  ])
  res.send({following: follow.following})
  
})


app.post('/profileedit/:userid', verifyToken, (req, res) => {
    const updatedData = req.body;
    const userid = req.params.userid;
    const useridfound = db.collection('users').findOne({ id: Number(userid) }) //check if we could find the user id data

    if (useridfound) {
        console.log("updated data?", updatedData.username)
        const id_filter = { id: Number(userid) };
        const updateData = { username: updatedData.username, school: updatedData.school, firstname: updatedData.firstname, lastname: updatedData.lastname, email: updatedData.email }
        const update = { $set: updateData };

        const getUser = db.collection('users').updateOne(id_filter, update).then(
            console.log("Successfully updated")
        ).catch(error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while updating the document' });
        });

    } else {
        console.error('User not found');
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



app.get("/rankings", (req, res) => {
  res.send("THIS IS RANKINGS");
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

})

const port = process.env.PORT || 3080;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
