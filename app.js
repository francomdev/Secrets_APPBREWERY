require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
const md5 = require("md5")
const bcrypt = require('bcrypt')
const saltRounds = 10

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String, 
    password: String
})

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
    res.render("home.ejs")
})

app.get("/login", (req, res) => {
    res.render("login.ejs")
})

app.get("/register", (req, res) => {
    res.render("register.ejs")
})

app.post("/register", (req, res) => {
     bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err)
        } else {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
        newUser.save()
    }
    })
    
    res.render("secrets.ejs")
})

app.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    
    User.findOne({email: username}).then( (foundUser) => {
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result) {
                res.render("secrets.ejs")
            } else {
                console.log("Wrong password")
            }
            });
        } else {
            console.log("User not found")
        }
    })
})


app.listen(3000, () => {
    console.log("Server listening on port 3000")
})