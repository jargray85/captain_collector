const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

// User Model
const User = require('../models/users.js')

// Route for User registration page
router.get('/register', (req, res) => {
    res.render('users/register.ejs', { currentUser: req.session.currentUser })
})

// Registration Post route
router.post('/register', (req, res) => {
    // Salt Encryption
    const salt = bcrypt.genSaltSync(10)
    // now we're going to generate the actual hashed password
    console.log(req.body) // this will show no encrypted data (password)
    req.body.password = bcrypt.hashSync(req.body.password, salt) // this encrypts
    console.log(req.body) // this pw will show encryption

    // first lets see if somebody else already has this username
    User.findOne({username: req.body.username}, (err, userExists) => {
        if (userExists) {
            res.send('that username is taken')
        } else {
            User.create(req.body, (err, createdUser) => {
                console.log(createdUser)
                req.session.currentUser = createdUser
                res.send('user created')
            })
        }
    })
})

// Sign in page route
router.get('/signin', (req, res) => {
    res.render('users/signin.ejs', { currentUser: req.session.currentUser })
})

// Sign in post route
router.post('/signin', (req, res) => {
    // we need to get the user with that username
    User.findOne({username: req.body.username}, (err, foundUser) => {
        if (foundUser) {
            // Compare passwords with compareSync
            const validLogin = bcrypt.compareSync(req.body.password, foundUser.password)
            // compareSync returns true if they match and false if they don't
            // if the passwords match, log them in
            if (validLogin) {
                req.session.currentUser = foundUser
                // we are letting the session know that we have logged in
                res.redirect('/captain-collector')
            } else {
                res.send('Invalid username or password')
            }
        } else {
            // if user does not exist we need to send a message
            res.send('Invalid username or password')
        }
    })
})

// DESTROY Session
router.get('/signout', (req, res) => {
    // this destroys the session
    // you can always access the user IF signed in, in this req object
    req.session.destroy()
    res.redirect('/captain-collector')
})

module.exports = router