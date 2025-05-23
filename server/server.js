const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const Checkin = require("./models/checkin");
const Guestcheckin = require("./models/guestcheckin");
const Post = require("./models/post");
const Supervisor = require("./models/supervisor");
const Supervisor_tem = require("./models/supervisor_tem");
const Organization = require("./models/organization");
const School = require("./models/school");
const Notification = require("./models/notification");




const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcrypt");
const initializePassport = require("./passport-config");
//const flash = require("express-flash");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("./config");
const verifyToken = require("./verifyToken");
// const ngeohash = require('ngeohash')
const Joi = require("joi");
const schemas = require("./schemas");  //joi
const middleware = require("./middleware");


const passwordResetRoute = require("./passwordreset");
const superviseEventsRoute = require("./superviseevent");
const sendOTPRoute = require("./event-otp");

const db = mongoose.connection;

const multer = require("multer");
const { storage } = require("../cloudinary");
const { cloudinary } = require("../cloudinary");
const { verify } = require("crypto");

// creating variables
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let randomId = "";
let posts = [];  //an array used to store 5 posts on each page for a user
const userSocketMap = {};

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

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origins: ["http://localhost:4200"],
  },
});

mongoose
  .connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {console.log("MongoDB Connected Successfully");})
  .catch((err) => console.error("MongoDB Connection Failed:", err));


app.use("/api", passwordResetRoute);
app.use("/supervisorapi", superviseEventsRoute);

io.on("connection", (socket) => {
  console.log("a user connected");
  const socketid = socket.id;
  socket.on("user", (user) => {
    userSocketMap[user] = socket.id;
    // console.log(userSocketMap);
  });
  socket.on("removeuser", (userid) => {
    if (userSocketMap.hasOwnProperty(userid)) {
      delete userSocketMap[userid];
      console.log("THE NEW DICT IS", userSocketMap);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
// ROUTES

app.use("/api", passwordResetRoute);
app.use("/api", sendOTPRoute);

app.get("/home/:page", verifyToken, async (req, res) => {
  // console.log("req from verifyToken: ", req);
  console.log("req from verifyToken!");
  page = req.params.page;
  console.log("page: ", page);
  const limit = 5;

  //find 5 documents of current page with Post combining with User 
  const allPosts = await Post.find({})
    .sort({ date: -1 })
    .populate([
      {
        path: "author",
        select: " _id username firstname lastname profilepicture",
      },
    ])
    .skip((page - 1) * limit)
    .limit(limit);

  //javascrip array function, map, extract the field that we need from the union of User and Post
  const postObjects = allPosts.map((post) => {
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
      imageurl: post.imageurl,
      likedBy: post.likedBy
    };
  });
  console.log('Got posts!');
  console.log(postObjects);
  res.send({ posts: postObjects });
});

app.get("/profile/:page/:userId", verifyToken, async (req, res) => {
  console.log("Receive call to get profile posts");
  page = req.params.page;
  let userId = req.params.userId;
  let query = {};
  if (userId !== undefined) {
    query = { author: userId };
  }
  const limit = 5;
  const allPosts = await Post.find(query)
    .populate([
      {
        path: "author",
        select: " _id username firstname lastname profilepicture",
      },
    ])
    .skip((page - 1) * limit)
    .limit(limit);
  const postObjects = allPosts.map((post) => {
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
      imageurl: post.imageurl,
    };
  });
  res.send({ posts: postObjects });
});

app.post(
  "/posts/submit/:userid",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    const postSchema = Joi.object({
      description: Joi.string().required().min(4).max(1000),
      location: Joi.string().max(200).required(),
      photo: Joi.string().max(200).optional().allow(null).allow(""),
    });

    const validationResult = postSchema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }

    // console.log(req.body);
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
      imageurl: req.file.path,
    });
    await post.save();
    foundUser.posts.unshift(post);
    res.json({ success: true, message: "Data received" });
  }
);

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
      id: post._id,
      author: post.author.username,
      location: post.location,
      date: post.date,
      time: post.time,
      description: post.description,
      likes: post.likes,
      imageurl: post.imageurl,
    };
  });
  // console.log(postObjects);
  res.send({ posts: postObjects });
});

app.post("/posts/togglelike", verifyToken, async (req, res) => {
  console.log('use toggled like button!');
  const user = await User.findById(req.body.userid);
  const post = await Post.findById(req.body.postid);
  console.log('user as was: ', user);
  console.log('post as was: ', post);
  if (req.body.addtoLike) {
    user.likedposts.push(post._id);
    const like = post.likes + 1;
    post.likes = like;
    // post.likedBy.push(user);
    post.likedBy.push({ id: user._id, username: user.username });
    console.log('a user liked a post');
  } else {
      //use filter to ceate a new array filled with element that passed the condition "postId != req.body.postid"
      user.likedposts = user.likedposts.filter((postId) => {
      postId !== req.body.postid;
      });
      if (post.likes > 0) {
        //update the number of likes to this post
        const like = post.likes - 1;
        post.likes = like;
        //update the users that like this post
        const likedByArray = post.likedBy.filter((likedUser)=>{likedUser.id !== user.id});
        post.likedBy = likedByArray;
      }
      console.log('a user unliked a post');
  }
  await user.save();
  await post.save();
  console.log('user as is: ', user);
  console.log('post as is: ', post);
  return res.status(201).json({ message: "Like toggled" });
});


// Clear the likedBy field for all posts
async function clearLikedByField() {
  try {
    const result = await Post.updateMany({}, { $set: { likedBy: [], likes: 0 } });
    console.log('LikedBy fields cleared:', result);
  } catch (err) {
    console.error('Error clearing likedBy fields:', err);
  }
}

// Clear the likedPosts field for all users
async function clearLikedPostsField() {
  try {
    const result = await User.updateMany({}, { $set: { likedposts: [] } });
    console.log('likedposts fields cleared:', result);
  } catch (err) {
    console.error('Error clearing likedposts fields:', err);
  }
}

// clearLikedByField(); //Call this to reset likedBy and likes field, only used when developing
// clearLikedPostsField(); //Call this to reset likepostsfield, only used when developing




app.post(
  "/signup",
  upload.single("profilePicture"),
  middleware(schemas.signupPost),
  async (req, res) => {
    // Jack should work here. Receive the userdata and store it in the "User" collection.
    console.log("receive signup notification");
    if (req.file) {
      var profilePicture = req.file.path;
    } else {
      var profilePicture =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
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
      const foundSchool = await School.findOne({ name: school });  //no need to find school from DB?? school is hard-coded in signup.component.ts??
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        profilepicture: req.file.path,
        school: foundSchool, //no need to find school from DB?? school is hard-coded in signup.component.ts??
      });

      if (req.body.password == null) {   //passwod is already validated in schema.js by Joi(#14)??
        console.log("No password");
      }
      newUser.password = newUser.generateHash(req.body.password);
      newUser.role = 0;
      await newUser.save();
      console.log("user saved");
      res.status(200).json({ message: "Signup successful" });
    } catch (error) {
      console.error("Error signing up: ", error);
      res.redirect("/signup");
    }
  }
);

// app.post(
//   "/login",
//   passport.authenticate("local"),
//   middleware(schemas.loginPost),
//   async function (req, res) {
//     const token = jwt.sign({ id: req.user._id }, config.secretKey, {
//       expiresIn: config.expiresIn,
//     });
//     const tempUser = await User.findById(req.user._id).populate([
//       {
//         path: "school",
//         select: "name",
//       },
//       {
//         path: "notifications",
//         select: "type date isRead",
//         populate: [
//           {
//             path: "follower",
//             select: "firstname lastname profilepicture",
//           },
//           {
//             path: "event",
//             select: "name",
//           },
//           {
//             path: "from",
//             select: "firstname lastname",
//           },
//         ],
//       },
//     ]);
//     res.json({
//       token: token,
//       user: tempUser,
//     });
//   }
// );

app.post(
  "/login",
  passport.authenticate("local"),
  middleware(schemas.loginPost),
  async function (req, res) {
    const token = jwt.sign({ id: req.user._id }, config.secretKey, {
      expiresIn: config.expiresIn,
    });
    const tempUser = await User.findById(req.user._id).populate([
      {
        path: "school",
        select: "name",
      },
      {
        path: "notifications",
        select: "type date isRead",
        populate: [
          {
            path: "follower",
            select: "firstname lastname profilepicture",
          },
          {
            path: "event",
            select: "name",
          },
          {
            path: "from",
            select: "firstname lastname",
          },
        ],
      },
    ]);
    res.json({
      token: token,
      user: tempUser,
    });
  }
);

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

app.get("/profile/:userid", verifyToken, async (req, res) => {
  // console.log(req.params.userid);
  const user = await User.findById(req.params.userid).populate(
    "school",
    "name"
  );
  res.send(user);
});

// app.get("/eventdetails/:eventid", (req, res) => {
//   res.send("HERE WE HAVE EVENT DETAILS");
// });

app.put(
  "/profileedit/:userid",
  upload.single("profilepicture"),
  async (req, res) => {
    //
    try {
      const updatedData = req.body;
      const check_file = req.file;
      //find school id by school name
      const schoolDocument = await School.findOne({ name: req.body.school });
      const schoolID = schoolDocument._id;
      const user = await User.findById(req.params.userid);
      (user.username = req.body.username),
        (user.firstname = req.body.firstname),
        (user.lastname = req.body.lastname),
        (user.email = req.body.email);
      if (check_file) {
        user.profilepicture = req.file.path;
      }
      await user.save();
      res.status(201).json({ message: "profile updated created" });
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
    await user.save();
    res.status(201).json({ message: "profile updated created" });
  }
);

app.get("/eventsearch", async (req, res) => {
  const getEvents = Event.distinct("name"); //.toArray()//OBJECT
  getEvents.then(function (result) {
    res.json(result);
  });
});

app.get("/usersearch", async (req, res) => {
  const getEvents = User.distinct("username"); //.toArray()//OBJECT
  getEvents.then(function (result) {
    res.json(result);
  });
});

app.post("/createevent", middleware(schemas.eventPOST), async (req, res) => {
  //console.log("req.body: " + JSON.stringify(req.body)); //{"Name":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
  //console.log("req.body.Name: " + req.body.Name); //Great event

  //extract every property from req.body and store them to the variable defined inside const{ }
  //these variables can later be used directly. Warning: these variables have to be exactly the same
  //as in the eventForm, or it'll become undefined.
  var {
    name,
    date,
    start_time: { hour, minute},
    end_time: { hour, minute },
    location: { street, city, state },
    description,
  } = req.body;
  console.log('backend has received the data from event-service.service');
  // console.log('backend has received the data from event-service.service:', req.body)

  /*console.log("name: " + name);
  console.log("date: " + date);
  console.log("time: " + time);
  console.log("location: " + location);
  console.log("description: " + description);*/

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
  console.log('a new random is created: ', id)

  const newEvent = new Event({
    id,
    name,
    // imageurl,
    date,
    start_time: {
      hour,
      minute,
    },
    end_time: {
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
});

app.get("/events", async (req, res) => {
  //await Event.deleteMany({});   //uncomment this line of code only when you want to delete all the document in the DB
  const events = await Event.find();
  // console.log("events: " + events);
  res.send(events);
});

app.get("/event/:eventId", async (req, res) => {
  const eventId = req.params.eventId;
  console.log("eventID: " + eventId);
  try {
    // Find the event by eventId
    // const event = await Event.findOne({ _id: eventId })
    const event = await Event.findById(eventId);

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

app.get("/following/:userid", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.userid);
  // console.log(req.params.id);
  const follow = await user.populate([
    { path: "following", select: "username firstname lastname profilepicture" },
  ]);
  // console.log(follow);
  res.send({ following: follow.following });
});

app.get("/follower/:userid", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.userid);
  const follow = await user.populate([
    {
      path: "followers",
      select: "username firstname lastname profilepicture",
      populate: {
        path: "school",
        select: "name",
      },
    },
  ]);
  // console.log(follow);
  res.send({ followers: follow.followers });
});

app.get("/following/:userid", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.userid);
  res.send(user);
});

app.post("/follow/:myid/:userid/:isfollowing", async (req, res) => {
  const isfollowing = req.params.isfollowing;
  const myid = req.params.myid;
  const userid = req.params.userid;
  const socketid = userSocketMap[userid];
  if (isfollowing == "false") {
    //append myid to user's follower
    const user = await User.findById(userid);
    const me = await User.findById(myid);
    user.followers.push(myid);
    const notification = new Notification({
      type: "follow",
      to: user._id,
      from: myid,
      follower: myid,
      isRead: false,
    });
    console.log("THE NOTIFICATION IS", notification);
    user.notifications.unshift(notification);
    await notification.save();
    // append userid to my following list
    const myuser = await User.findById(myid);
    myuser.following.push(userid);
    await user.save();
    await myuser.save();
    console.log("THE USER IS", user);
    if (socketid) {
      const newNotification = {
        type: "follow",
        date: Date.now(),
        follower: {
          _id: myid,
          firstname: me.firstname,
          lastname: me.lastname,
          profilepicture: me.profilepicture,
        },
        from: {
          firstname: me.firstname,
          lastname: me.lastname,
          _id: myid,
        },
        isRead: false,
        _id: notification._id,
      };
      io.to(socketid).emit("newFollower", newNotification);
    }
    res.status(201).json({ message: "follow updated" });
  } else {
    //pop out myid from user's follower
    const user = await User.findById(userid);
    user.followers.pull(myid);

    // append userid to my following list
    const myuser = await User.findById(myid);
    myuser.following.pull(userid);
    await user.save();
    await myuser.save();
    io.to(myid).emit("followUpdated");
    res.status(201).json({ message: "unfollow updated" });
  }
});

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

app.get("/searchevent/:eventname", verifyToken, async (req, res) => {
  const event = await Event.findOne({ name: req.params.eventname });
  if (event) {
    res.json(event);
  } else {
    res.status(500).json({ message: "no such event" });
  }
});

app.get("/api/getAllEvents", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

app.get("/api/getAllCheckin", async (req, res) => {
  try {
    const checkin = await Checkin.find({});
    res.json(checkin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching check in data." });
  }
});

app.get("/api/getAllGuestCheckin", async (req, res) => {
  try {
    const checkin = await Guestcheckin.find({});
    res.json(checkin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching check in data." });
  }
});

app.post("/api/deleteAllCheckin", async (req, res) => {
  try {
    await Checkin.deleteMany({});
    res.status(200).json({ message: "All checkin data has been deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while deleting checkin data" });
  }
});

app.post("/api/deleteAllGuestCheckin", async (req, res) => {
  try {
    await Guestcheckin.deleteMany({});
    res
      .status(200)
      .json({ message: "All guest checkin data has been deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while deleting checkin data" });
  }
});


//an api to add points to specified user by userid
app.post("/api/student/addpoints", async (req, res) => {

  console.log("adding points to the student....");
  // console.log("req.body: ", req.body)
  const user = await User.findById(req.body.userid);
  console.log("user is found: \n", user)
  console.log("req.body.points: ", req.body.points)
  user.points += req.body.points
  console.log("user.points: ", user.points)
  await user.save();
  return res.status(200)
            .json({message: `${req.body.points} points added for user: ${user.username}`});

});

//an api to get all students' points
app.get("/api/student/points", async (req, res) => {
  console.log("get all students' points!")
  const usersWithPoints = await User.find({}, 'username points');
  // console.log(usersWithPoints);
  res.status(200).json({
    message: "Success",
    usersWithPoints: usersWithPoints
  });
});

//an api to get rankings
app.get("/api/rankings", async (req, res) => {
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



app.get("/ranking/student", verifyToken, async (req, res) => {
  try {
    // Retrieve the top 10 users with the most points
    const topUsers = await User.find().sort({ points: -1 }).limit(10);
    // Send the top users as a JSON response
    console.log("Fetched top students data from server!");
    res.json(topUsers);
  } catch (error) {
    console.log("Error retrieving top users", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the top users" });
  }
});

app.get("/ranking/school", verifyToken, async (req, res) => {
  try {
    // Retrieve the top 10 users with the most points
    const topSchools = await School.find().sort({ points: -1 }).limit(10);
    // Send the top users as a JSON response
    console.log("Fetched top schools data from server!", );
    res.json(topSchools).toString;
  } catch (error) {
    console.log("Error retrieving top schools", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the top schools" });
  }
});

app.post("/api/guestcheckin", async (req, res) => {
  try {
    const { email, eventId, memberEmail } = req.body;
    console.log("Member email: " + memberEmail);
    const user = await User.findOne({ email: memberEmail });
    //Check if the host user exists
    if (user) {
      const userId = user._id;
      const existingCheckIn = await Guestcheckin.findOne({
        email: email,
        eventId: eventId,
      });

      if (existingCheckIn) {
        return res.status(400).json({ error: "Guest is already checked in." });
      }
      const newCheckIn = new Guestcheckin({
        email: email,
        eventId: eventId,
        refUser: userId,
      });

      await newCheckIn.save();

      res.json({ message: "Guest checked in successfully!!" });
    } else {
      res.status(400).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred!!" });
  }
});

app.post("/api/checkin", async (req, res) => {
  try {
    const { studentId, eventId } = req.body;
    const user = await User.findById({ studentId });
    if (user) {
      const userId = user._id;
      const existingCheckIn = await Checkin.findOne({
        userId: userId,
        eventId: eventId,
      });

      if (existingCheckIn) {
        return res.status(400).json({ error: "User is already checked in." });
      }
      const newCheckIn = new Checkin({
        userId: userId,
        eventId: eventId,
      });

      await newCheckIn.save();

      res.json({ message: "User checked in successfully!!" });
    } else {
      res.status(400).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred!!" });
  }
});

//Handles the checkout user logic
app.post("/api/checkout", async (req, res) => {
  try {
    const { studentId, eventId, mood } = req.body;
    const user = await User.findById({ studentId });
    if (user) {
      const userId = user._id;
      const existingCheckIn = await Checkin.findOne({
        userId: userId,
        eventId: eventId,
      });
      if (!existingCheckIn) {
        return res.status(400).json({ error: "User has not been checked in." });
      }
      if (existingCheckIn.checkOutTime !== null) {
        return res
          .status(400)
          .json({ error: "User has already been checked out." });
      }
      existingCheckIn.checkOutTime = new Date();
      existingCheckIn.mood = mood;
      const timeDifferenceInMilliseconds =
        existingCheckIn.checkOutTime - existingCheckIn.checkInTime;
      const timeDifferenceInMinutes =
        timeDifferenceInMilliseconds / (1000 * 60);
      const intervalMinutes = 15;
      const intervals = Math.round(timeDifferenceInMinutes / intervalMinutes);

      // Calculate points
      const points = intervals * 0.25;
      console.log("Points to add: " + points);
      user.points += points;

      await existingCheckIn.save();
      await user.save();

      res.json({ message: "Check out successfully." });
    } else {
      res.status(400).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred!!!" });
  }
});

app.post("/api/guestcheckout", async (req, res) => {
  try {
    const { email, eventId, mood } = req.body;
    const existingCheckIn = await Guestcheckin.findOne({
      email: email,
      eventId: eventId,
    }).populate("refUser");
    if (!existingCheckIn) {
      return res.status(400).json({ error: "User has not been checked in." });
    }
    if (existingCheckIn.checkOutTime !== null) {
      return res
        .status(400)
        .json({ error: "Guest has already been checked out." });
    }
    const user = existingCheckIn.refUser;
    if (user) {
      existingCheckIn.checkOutTime = new Date();
      existingCheckIn.mood = mood;
      const timeDifferenceInMilliseconds =
        existingCheckIn.checkOutTime - existingCheckIn.checkInTime;
      const timeDifferenceInMinutes =
        timeDifferenceInMilliseconds / (1000 * 60);
      const intervalMinutes = 15;
      const intervals = Math.round(timeDifferenceInMinutes / intervalMinutes);

      // Calculate points
      const points = intervals * 0.25;
      console.log("Points to add: " + points);
      user.points += points;

      await existingCheckIn.save();
      await user.save();

      res.json({ message: "Check out successfully." });
    } else {
      res.status(400).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred!!!" });
  }
});

app.get("/recommend/:userid", async (req, res) => {
  const userRes = [];
  const alreadyAdded = [];
  const user = await User.findById(req.params.userid);
  const school = await School.findById(user.school);
  const userBySchool = await User.find({
    school: school._id,
    _id: { $ne: req.params.userid },
  }); //.populate('school')
  for (i = 0; i < userBySchool.length; i++) {
    if (user.following.includes(userBySchool[i]._id)) {
      continue;
    }
    const tempUser = {
      id: userBySchool[i]._id,
      username: userBySchool[i].username,
      firstname: userBySchool[i].firstname,
      lastname: userBySchool[i].lastname,
      profilepicture: userBySchool[i].profilepicture,
      //school: userBySchool[i].school.name,
      points: userBySchool[i].points,
    };
    alreadyAdded.push(tempUser.username);
    userRes.push(tempUser);
  }

  const userByPoints = await User.find({
    points: user.points,
    _id: { $ne: req.params.userid },
  }); //.populate('school')
  for (i = 0; i < userByPoints.length; i++) {
    if (
      user.following.includes(userByPoints[i]._id) ||
      alreadyAdded.includes(userByPoints[i].username)
    ) {
      continue;
    }
    const tempUser = {
      id: userByPoints[i]._id,
      username: userByPoints[i].username,
      firstname: userByPoints[i].firstname,
      lastname: userByPoints[i].lastname,
      profilepicture: userByPoints[i].profilepicture,
      //school: userByPoints[i].school.name,
      points: userByPoints[i].points,
    };
    userRes.push(tempUser);
  }
  // console.log(userRes);
  res.json(userRes);
});
app.get("/supervisor/eventlist", async (req, res) => {
  const event = await Event.find({});

  res.json(event);
});

app.post("/getUsernames", async (req, res) => {
  const userIds = req.body.userIds; // Assuming the frontend sends an array of user IDs
  const usernames = [];
  const users = {};
  for (const id of userIds) {
    const user = await User.findOne({ _id: id });
    if (user) {
      usernames.push(user.username);
      users[id] = user.username;
    }
  }
  // console.log(users);

  // Send the list of usernames as the HTTP response
  res.json(users);
});

app.put("/notifications/readnotification", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    const notification = await Notification.findById(id);
    notification.isRead = true;
    notification.save();
    res.status(200).json({ success: true, message: "Notification read saved" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error!!!" });
  }
});
//post when user attend events
app.post("/attendevent/:eventid/:userid/:state", async (req, res) => {
  const eventid = req.params.eventid;
  const userid = req.params.userid;
  const state = req.params.state;
  //console.log("state", state)
  const user = await User.findOne({ _id: userid });

  //Convert eventid and userid to MongoDB ObjectIDs
  const eventObjectId = new mongoose.Types.ObjectId(eventid);
  const userObjectId = new mongoose.Types.ObjectId(userid);
  const event = await Event.findOne({ _id: eventObjectId });
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  if (state == "true") {
    //push the userid into registered and save
    if (!event.registered) {
      event.registered = [userObjectId];
    } else if (!user.eventsAttended) {
      user.eventsAttended = [eventObjectId];
    }

    event.registered.push(userObjectId);
    user.eventsAttended.push(eventObjectId);
    await event.save();
    await user.save();
  } else {
    event.registered.pull(userObjectId);
    user.eventsAttended.pull(eventObjectId);
    await event.save();
    await user.save();
  }
});

app.post("/orgsignup", upload.single("profilePicture"), async (req, res) => {
  console.log("receive signup notification");
  if (req.file) {
    var profilePicture = req.file.path;
  } else {
    var profilePicture =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
  }

  try {
    const { name, email, phone, location } = req.body;

    //Check if email already exists
    const existingEmail = await Organization.findOne({ email });
    if (existingEmail) {
      console.log("email already exists");
      return res.status(409).json({ message: "Email already exists" });
    }
    const newOrg = new Organization({
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      profilepicture: req.file.path,
    });

    if (req.body.password == null) {
      console.log("No password");
    }
    newOrg.password = newOrg.generateHash(req.body.password);
    await newOrg.save();
    console.log("Org_db saved");

    const schoolObjectId = new mongoose.Types.ObjectId(
      "64a3b104c7380cc713d41020"
    ); //set school to not above
    //make a copy to user Database
    const newUser = new User({
      email: req.body.email,
      username: req.body.name,
      firstname: req.body.name,
      lastname: req.body.name,
      profilepicture: req.file.path,
      school: schoolObjectId,
    });
    newUser.role = 1;
    newUser.password = newOrg.generateHash(req.body.password);
    await newUser.save();
    console.log("User_db saved");
    res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error signing up: ", error);
    res.redirect("/orgsignup");
  }
});

app.post("/supsignup", upload.single("profilePicture"), async (req, res) => {
  console.log("receive signup notification");
  if (req.file) {
    var profilePicture = req.file.path;
  } else {
    var profilePicture =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
  }

  try {
    const { username, firstname, lastname, email, phone } = req.body;

    //Check if email already exists
    const existingEmail = await Supervisor.findOne({ email });
    if (existingEmail) {
      console.log("email already exists");
      return res.status(409).json({ message: "Email already exists" });
    }
    const newOrg = new Supervisor({
      email: req.body.email,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      profilepicture: req.file.path,
    });

    if (req.body.password == null) {
      console.log("No password");
    }
    newOrg.password = newOrg.generateHash(req.body.password);
    await newOrg.save();
    console.log("sup_db saved");

    const schoolObjectId = new mongoose.Types.ObjectId(
      "64a3b104c7380cc713d41020"
    ); //set school to not above
    //make a copy to user Database
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      profilepicture: req.file.path,
      school: schoolObjectId,
    });
    newUser.role = 2;
    newUser.password = newOrg.generateHash(req.body.password);
    await newUser.save();
    console.log("supervisor saved");
    res.status(200).json({ message: "Signup successful" });
    res.redirect("/supervisorlogin");
  } catch (error) {
    console.error("Error signing up: ", error);
    res.redirect("/supsignup");
  }
});
//supervisor log in backend
app.post(
  "/supervisorlogin",
  passport.authenticate("local"),
  async function (req, res) {
    const token = jwt.sign({ id: req.user._id }, config.secretKey, {
      expiresIn: config.expiresIn,
    });

    const tempUser = await Supervisor.findById(req.user._id);
    console.log("temsupervisor", tempUser);
    res.json({
      token: token,
      user: tempUser,
    });
  }
);

app.get("/supervisorcheck/:userid", async (req, res) => {
  const supervisorid = new mongoose.Types.ObjectId(req.params.userid);
  const supervisor = await Supervisor.findOne({ _id: supervisorid });
  if (supervisor) {
    res.json({ exists: true }); // Supervisor exists
  } else {
    res.json({ exists: false }); // Supervisor does not exist
  }
});

app.get("/supervisorcheck/:eventid/:supervisorid", async (req, res) => {
  //http://localhost:3080/supervisorcheck/653eeacc180c3ae1a2dcf019/64c6f576974de6f0d85a474f
  //GET the JSON of id and Name of attandants
  const supervisorid = new mongoose.Types.ObjectId(req.params.supervisorid);
  const eventid = new mongoose.Types.ObjectId(req.params.eventid);

  const supervisor = await Supervisor.findOne({ _id: supervisorid });
  const event = await Event.findOne({ _id: eventid });
  async function getEvent(eventId) {
    try {
      // Find the event by eventId
      // const event = await Event.findOne({ _id: eventId })
      const event = await Event.findById(eventId);

      if (event) {
        let usernames = {};
        let userIds = event.attendants;
        // get names and ids.
        await User.find({ _id: { $in: userIds } })
          .then((users) => {
            for (let i = 0; i < users.length; i++) {
              usernames[users[i]._id] =
                users[i].firstname + " " + users[i].lastname;
            }
            // Handle the found users
          })
          .catch((err) => {
            console.error("Error:", err);
            // Handle the error as needed
          });

        //console.log(usernames)
        res.send(usernames);
      } else {
        res.status(404).json({ message: "Event not found" });
      }
    } catch (error) {
      console.error("Error retrieving event: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  if (supervisor) {
    if (supervisor.eventsupervise.includes(eventid)) {
      getEvent(eventid);
    } else {
      res.json({ eventexists: false }); // Supervisor exists, event does not exist
    }
  } else {
    res.json({ supervisorExists: false }); // Supervisor does not exist
    return;
  }
});

app.post("/supervisorcheck/attendances/:eventId", async (req, res) => {
  try {
    const eventid = req.params.eventId;
    const { attendances } = req.body; // Make sure this matches the field name in your schema
    console.log("attendances", attendances);
    const updatedEvent = await Event.findByIdAndUpdate(
      eventid,
      { $set: { attendances } }, // Use 'attendances' here
      { new: true, upsert: true }
    );

    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating event: " + error.message);
  }
});

app.post("/superviseevent/:eventid/:supervisorid/:state", async (req, res) => {
  const eventid = req.params.eventid;
  const supervisorid = req.params.supervisorid;
  const state = req.params.state;
  const supervisor = await Supervisor.findOne({ _id: supervisorid });

  if (!supervisor) {
    console.log("no supervisor error", supervisorid);
  }

  //Convert eventid and userid to MongoDB ObjectIDs
  const eventObjectId = new mongoose.Types.ObjectId(eventid);
  const supervisorObjectId = new mongoose.Types.ObjectId(supervisorid);
  const event = await Event.findOne({ _id: eventObjectId });
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (state == "true") {
    //push the supervisorid into events and save
    if (!event.supervisor) {
      event.supervisor = [supervisorObjectId];
    } else {
      event.supervisor.push(supervisorObjectId);
    }

    if (!supervisor.eventsupervise) {
      supervisor.eventsupervise = [eventObjectId];
    } else {
      supervisor.eventsupervise.push(eventObjectId);
    }
    await event.save();
    await supervisor.save();
  } else {
    event.supervisor.pull(supervisorObjectId);
    supervisor.eventsupervise.pull(eventObjectId);
    await event.save();
    await supervisor.save();
  }
});
app.get("/eventsupervised/:userid", async (req, res) => {
  const supervisorid = new mongoose.Types.ObjectId(req.params.userid);
  const supervisor = await Supervisor.findOne({ _id: supervisorid });

  if (supervisor && supervisor.eventsupervise) {
    res.json(supervisor.eventsupervise);
  } else {
    res.json({ message: "no supervisor.eventsupervise" });
  }
});

app.put("/notifications/readnotification", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    const notification = await Notification.findById(id);
    notification.isRead = true;
    notification.save();
    res.status(200).json({ success: true, message: "Notification read saved" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error!!!" });
  }
});

app.use((req, res) => {
  res.status(404).send("404 PAGE NOT FOUND");
});

const port = process.env.PORT || 3080;

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
