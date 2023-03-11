// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const Comic = require('./models/comics.js')
require('dotenv').config()

// GLOBAL CONFIGURATION
const db = mongoose.connection

// CONNECT TO MONGO
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// ERROR/SUCCESS LOGS
db.on('error', (err) => console.log(`${err.message} is MongoDB Not Running?`))
db.on('connected', () => console.log('mongodb connected'))
db.on('disconnected', () => console.log('mongo disconnected'))

// MIDDLEWARE
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))

// SEED DATA FUNCTION
// const seedData = require('./models/seed.js')
// Comic.insertMany(seedData, (err, comics) => {
//     if (err) {console.log(err)}
//     else {console.log(comics)}
//     db.close()
// })

// ROUTES - I.N.D.U.C.E.S

// INDEX
app.get('/captain-collector', (req, res) => {
    Comic.find({}, (err, allComics) => {
        res.render('index.ejs', {
            comics: allComics
        })   
    })  
})

// NEW
app.get('/captain-collector/new', (req, res) => {
    res.render('new.ejs')
})

// D

// U

// CREATE
app.post('/captain-collector', (req, res) => {
    Comic.create(req.body, (err, createdComic) => {
        if (err) {console.log(err)}
        else {res.redirect('/captain-collector')
        console.log(createdComic)}
    })
})

// EDIT
app.get('/captain-collector/:id/edit', (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        res.render('edit.ejs', {
            comic: foundComic
        })
    })
})

// SHOW
app.get('/captain-collector/:id', (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        res.render('show.ejs', {
            comic: foundComic
        })
    })
})

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Hello Seattle, I\'m listening... on PORT', PORT)
})