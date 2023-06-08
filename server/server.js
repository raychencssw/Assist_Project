const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path')
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post')
const multer = require('multer');
// const ngeohash = require('ngeohash');
const {storage}= require('../cloudinary')
const {cloudinary} = require('../cloudinary');

// creating variables
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let randomId = '';
let posts = []

const db = mongoose.connection;
const upload = multer({ storage: storage })

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }))

let db_url = 'mongodb+srv://jitbaner:4r17oq9ZuznScSih@cluster0.znvt1pl.mongodb.net/AssistProject?retryWrites=true&w=majority'


    // DATABASE CONNECTION
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch((e) => {
        console.log("Error!");
        console.log(e);
    })



    // ROUTES

app.get('/home', async(req, res) => {
    const allPosts = await Post.find({}).populate('author', 'username') //.populate('author', 'firstname')
    const postObjects = allPosts.map(post => {
        return {
          id: post.id,
          author: post.author.username,
          location: post.location,
          date: post.date,
          time: post.time,
          description: post.description,
          likes: post.likes,
          imageurl: post.imageurl
        };
    });
    console.log(postObjects)
    res.send({ posts: postObjects })
})

app.post('/posts/submit', upload.single('photo'), async(req, res) => {
    // const data = req.body.post
    // posts.push(data)
    // console.log(posts)
    console.log(req.body, req.file)
    // this needs to be changed after authentication
    foundUser = await User.findOne({id: 1})

    // getting todays date and time
    const today = new Date()
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const formattedDate = today.toLocaleDateString('en-US', options);
    let hours = today.getHours();
    let minutes = today.getMinutes();
    minutes = String(minutes).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;
    console.log(formattedDate, formattedTime)

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
        imageurl: req.file.path

    })
    await post.save()
    foundUser.posts.push(post)
    res.json({ success: true, message: "Data received" })


})

// app.get('/signup', async (req, res)=>{
//     const user = new User({id: 1, username: 'test', email: 'test@test.com', firstname: 'testFirst', lastname: 'testLast', role: 1, points: 14})
//     await user.save()
//     res.send(user)
// })

app.post('/signup', (req, res) => {
    // Jack should work here. Receive the userdata and store it in the "User" collection.
})

app.post('/login', (req, res) => {
    // receive the data here and check if the user exists if it does return a random response. As of now nothing more than this.
})


app.get('/qrscan', (req, res) => {
    res.send("HERE WE WILL HAVE QR SCANNER")
})


app.get('/eventdetails/:eventid', (req, res) => {
    res.send("HERE WE HAVE EVENT DETAILS")
})


app.post('/createevent', (req, res) => {
    res.send("THIS IS NEW EVENT POST")
})


app.get('/profile/:userid', (req, res) => {
    // Retrieve user with the specified ID from the data source
    const userid = req.params.userid;
    const getUser = db.collection('users').findOne({ id: Number(userid) })//promise
    getUser.then(function (result) {
        res.json(result)
        console.log('user_info', result);
    })
})

app.get('/rankings', (req, res) => {
    res.send("THIS IS RANKINGS")
})

app.use((req, res)=>{
    res.status(404).send('404 PAGE NOT FOUND')
})

const port = process.env.PORT || 3080;

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})