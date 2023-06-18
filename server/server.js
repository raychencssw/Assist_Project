const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/user");
//const passport = require("passport");
//const initializePassport = require("./passport-config");
//initializePassport(passport);
// const ngeohash = require('ngeohash')
const Event = require("./models/event");  // instanitiate a model, in other words, document

// creating variables
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const posts = [];

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

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
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new User({
      username,
      email,
      firstname,
      lastname,
      profilepicture,
      role,
    });
    await newUser.save();
    console.log("user saved");
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error signing up: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  res.send("Login successful");
});

app.get("/home", (req, res) => {
  res.send({ posts: posts });
});

app.get("/qrscan", (req, res) => {
  res.send("HERE WE WILL HAVE QR SCANNER");
});

app.get("/eventdetails/:eventid", (req, res) => {
  res.send("HERE WE HAVE EVENT DETAILS");
});


app.post('/createevent', async (req, res)=>{

    //console.log("req.body: " + JSON.stringify(req.body)); //{"name":"Great event","date":"Great Day","time":"Great Time","location":"Great Locale","description":"Have fun"}

    //extract every property from req.body and store them to the variable defined inside const{ }
    //these variables can later be used directly. Warning: these variables have to be exactly 
    //the same as in the eventForm, or it'll become undefined.
    const {
        name,
        date,
        time,
        location:{
            street,
            city,
            state,
        },
        description,
    }  = req.body;

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

    const newEvent = new Event({
        id,
        name,
        date,
        time,
        location:{
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

app.get("/rankings", (req, res) => {
  res.send("THIS IS RANKINGS");
});

const port = process.env.PORT || 3080;

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
