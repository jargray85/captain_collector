// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Comic = require('./models/comics.js')
require('dotenv').config()
const usersController = require('./controllers/users.js')
const comicsController = require('./controllers/comics.js')
const session = require('express-session')

// Sessions
const SESSION_SECRET = process.env.SESSION_SECRET
console.log('Here is the session secret')
console.log(SESSION_SECRET)
// Secret
app.use(session({
    secret: SESSION_SECRET, 
    resave: true, // https://www.npmjs.com/package/express-session#resave
    saveUninitialized: true // ^^
}))

// GLOBAL CONFIGURATION
const db = mongoose.connection

// CONNECT TO MONGO
mongoose.connect(process.env.MONGODB_URI + '/captain-collector', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'captain-collector'
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
app.use('/users', usersController)

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