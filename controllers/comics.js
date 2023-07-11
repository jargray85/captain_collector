// Require Express
const express = require('express')

// Add express router 
const router = express.Router()

// Require model
const Comic = require('../models/comics.js')

// AUTH middleware
const authRequired = (req, res, next) => {
    console.log(req.session.currentUser)
    if (req.session.currentUser) {
        // a user is signed in
        next()
        // next is part of express, it does what it says: a continue in code
        // i.e. "go on to the next thing"
    } else {
        // if there is no user
        res.redirect('/users/signin')
        return
    }
}


// ROUTES - I.N.D.U.C.E.S

// INDEX
router.get('/', (req, res) => {
    Comic.find({}, (err, allComics) => {
        res.render('index.ejs', {
            comics: allComics,
            currentUser: req.session.currentUser
        })   
    })  
})

// ** SEARCH **
router.get('/search', (req, res) => {
    const searchQuery = req.query.search
    Comic.find({ title: { $regex: `${searchQuery}`, $options: 'i' }}, (err, searchResults) => {
        if (err) {console.log(err)}
        else {
            // console.log(searchResults)
            res.render('searchresults.ejs', {
                comics: searchResults
            })
        }
    })
})

// NEW
router.get('/new', (req, res) => {
    res.render('new.ejs', { currentUser: req.session.currentUser })
})

// DELETE
router.delete('/:id', authRequired, (req, res) => {
    Comic.findByIdAndDelete(req.params.id, (err, deleteComic) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(deleteComic)
            res.redirect('/captain-collector')
            return
        }
    })
})

// UPDATE
router.put('/:id', authRequired, (req, res) => {
    Comic.findByIdAndUpdate(req.params.id, req.body, { new: true}, 
        (err, updatedComic) => {
            if (err) {console.log(err), res.send(err)}
            else (console.log(updatedComic), res.redirect('/captain-collector'))
        })
})

// CREATE
router.post('/', (req, res) => {
    Comic.create(req.body, (err, createdComic) => {
        if (err) {console.log(err)}
        else {res.redirect('/captain-collector')
        console.log(createdComic)}
    })
})

// EDIT
router.get('/:id/edit', authRequired, (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        else {
        res.render('edit.ejs', {
            comic: foundComic,
            currentUser: req.session.currentUser
            })
        }
    })
})

// SHOW
router.get('/:id', (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        res.render('show.ejs', {
            comic: foundComic,
            currentUser: req.session.currentUser
        })
    })
})



module.exports = router