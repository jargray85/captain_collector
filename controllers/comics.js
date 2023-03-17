// Require Express
const express = require('express')

// Add express router 
const router = express.Router()

// Require model
const Comic = require('../models/comics.js')


// ROUTES - I.N.D.U.C.E.S

// INDEX
router.get('/', (req, res) => {
    Comic.find({}, (err, allComics) => {
        res.render('index.ejs', {
            comics: allComics
        })   
    })  
})

// ** SEARCH **
router.get('/search', (req, res) => {
    const searchQuery = req.query.search
    Comic.find({ title: { $regex: `${searchQuery}`, $options: 'i' }}, (err, searchResults) => {
        if (err) {console.log(err)}
        else {
            res.render('searchresults.ejs', {
                results: searchResults
            })
        }
        
    })
})

// NEW
router.get('/new', (req, res) => {
    res.render('new.ejs')
})

// DELETE
router.delete('/:id', (req, res) => {
    Comic.findByIdAndDelete(req.params.id, (err, deleteComic) => {
        if (err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(deleteComic)
            res.redirect('/captain-collector')
        }
    })
})

// UPDATE
router.put('/:id', (req, res) => {

    Comic.findByIdAndUpdate(req.params.id, req.body, { new: true}, 
        (err, updatedComic) => {
            if (err) {console.log(err), res.send(err)}
            else (console.log(updatedComic), res.redirect('/captain-collector'))
        }
        )
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
router.get('/:id/edit', (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        res.render('edit.ejs', {
            comic: foundComic
        })
    })
})

// SHOW
router.get('/:id', (req, res) => {
    Comic.findById(req.params.id, (err, foundComic) => {
        if (err) {console.log(err)}
        res.render('show.ejs', {
            comic: foundComic
        })
    })
})



module.exports = router