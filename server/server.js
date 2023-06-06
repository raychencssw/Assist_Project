const express= require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
// const ngeohash = require('ngeohash')
const Event = require("./models/event");

const posts = []

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}))

let db_url = 'mongodb+srv://jitbaner:4r17oq9ZuznScSih@cluster0.znvt1pl.mongodb.net/AssistProject?retryWrites=true&w=majority'


mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
        console.log("CONNECTION OPEN")
    })
    .catch((e) =>{
        console.log("Error!");
        console.log(e);
    })

app.post('/posts/submit', (req, res)=>{
    const data = req.body.post
    posts.push(data)
    console.log(posts)

    res.json({success: true, message: "Data received"})


})

// app.get('/signup', async (req, res)=>{
//     const user = new User({id: 1, username: 'test', email: 'test@test.com', firstname: 'testFirst', lastname: 'testLast', role: 1, points: 14})
//     await user.save()
//     res.send(user)
// })

app.post('/signup', (req, res)=>{
    // Jack should work here. Receive the userdata and store it in the "User" collection.
})

app.post('/login', (req, res)=>{
    // receive the data here and check if the user exists if it does return a random response. As of now nothing more than this.
})



app.get('/home', (req, res)=>{
    res.send({posts: posts})
})

app.get('/qrscan', (req, res)=>{
    res.send("HERE WE WILL HAVE QR SCANNER")
})


app.get('/eventdetails/:eventid', (req, res)=>{
    res.send("HERE WE HAVE EVENT DETAILS")
})


app.post('/createevent', async (req, res)=>{
    //can't access DB, need debug
    console.log("req.body: " + JSON.stringify(req.body)); //{"Name":"Great event","Date":"Great Day","Time":"Great Time","Location":"Great Locale","Description":"Have fun"}
    console.log("req.body.Name: " + req.body.Name); //Great event

    //extract every property from req.body and store them to the variable defined inside const{ }
    //these variables can later be used directly
    const {
        name,
        date,
        time,
        location,
        description,
    }  = req.body;

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


app.get('/profle/:userid', (req, res)=>{
    res.send("HERE IS MY PROFILE")
})

app.get('/rankings', (req, res)=>{
    res.send("THIS IS RANKINGS")
})


const port= process.env.PORT || 3080;

app.listen(port, () =>{
    console.log(`Server started at ${port}`);
})