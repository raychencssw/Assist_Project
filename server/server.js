const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')
// const ngeohash = require('ngeohash')
const db = mongoose.connection;
const posts = []

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }))

let db_url = 'mongodb+srv://jitbaner:4r17oq9ZuznScSih@cluster0.znvt1pl.mongodb.net/AssistProject?retryWrites=true&w=majority'


mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN")
    })
    .catch((e) => {
        console.log("Error!");
        console.log(e);
    })

app.post('/posts/submit', (req, res) => {
    const data = req.body.post
    posts.push(data)
    console.log(posts)

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



app.get('/home', (req, res) => {
    res.send({ posts: posts })
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


const port = process.env.PORT || 3080;

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})