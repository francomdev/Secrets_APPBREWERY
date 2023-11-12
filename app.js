require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String, 
    password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

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

app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    await newUser.save()
    res.render("secrets.ejs")
})

app.post("/login", (req, res) =>{
    const username = req.body.username
    const password = req.body.password
    User.findOne({email: username}).then( (foundUser) => {
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets.ejs")
            } else {
                console.log("Wrong password")
            }
        } else {
            console.log("User not found")
        }
    })
})


app.listen(3000, () => {
    console.log("Server listening on port 3000")
})