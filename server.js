// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const Comic = require('./models/comics.js')
require('dotenv').config()
const comicsController = require('./controllers/comics.js')


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
app.use('/captain-collector', comicsController)

// SEED DATA FUNCTION
// const seedData = require('./models/seed.js')
// Comic.insertMany(seedData, (err, comics) => {
//     if (err) {console.log(err)}
//     else {console.log(comics)}
//     db.close()
// })

// PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Hello Seattle, I\'m listening... on PORT', PORT)
})