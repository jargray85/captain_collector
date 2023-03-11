// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
require('dotenv').config()

// GLOBAL CONFIGURATION

// CONNECT TO MONGO

// ERROR/SUCCESS LOGS

// MIDDLEWARE
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))

// SEED DATA FUNCTION

// ROUTES - I.N.D.U.C.E.S

// INDEX
app.get('/captain-collector', (req, res) => {
    res.send('Index page')
})

// NEW
app.get('/captain-collector/new', (req, res) => {
    res.send('new page')
})

// D

// U

// C

// E


// S

// PORT
const PORT = 3000
app.listen(PORT, () => {
    console.log('Hello Seattle, I\'m listening... on PORT', PORT)
})