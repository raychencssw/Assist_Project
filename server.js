const express= require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require('path')
// const ngeohash = require('ngeohash')

const posts = []

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: true, credentials: true}))

app.post('/posts/submit', (req, res)=>{
    const data = req.body.post
    posts.push(data)
    console.log(posts)

    res.json({success: true, message: "Data received"})


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

app.get('/createevent', (req, res)=>{
    res.send("HERE WE HAVE CREATE EVENT PAGE")
})

app.get('/profle/:userid', (req, res)=>{
    res.send("HERE IS MY PROFILE")
})


const port= process.env.PORT || 3080;

app.listen(port, () =>{
    console.log(`Server started at ${port}`);
})