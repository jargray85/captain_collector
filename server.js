// DEPENDENCIES
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
require('dotenv').config()

// GLOBAL CONFIRGURATION

// CONNECT TO MONGO

// ERROR/SUCCESS LOGS

// MIDDLEWARE
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(methodOverride('_method'))

// SEED DATA FUNCTION

// ROUTES - I.N.D.U.C.E.S

// I

// N

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