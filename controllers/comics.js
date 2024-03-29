// Require Express
const express = require('express')

// Add express router 
const router = express.Router()

// Require User (for each unique user adding comics to their collection)
const User = require('../models/users.js')

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

    // User is logged in condition
    if (req.session.currentUser) {
        const userId = req.session.currentUser._id

        User.findById(userId)
            .populate('comics')
            .exec((err, foundUser) => {
                if (err) {
                    console.log(err)
                    res.send('Error retrieving user data.')
                    return
                }

                res.render('index.ejs', {
                    comics: foundUser.comics,
                    currentUser: req.session.currentUser
                })
            })
    } else {

        //User not logged in
        Comic.find({}, (err, allComics) => {
            res.render('index.ejs', {
                comics: allComics,
                currentUser: req.session.currentUser
            })   
        }) 
    }
})

// ** SEARCH **
router.get('/search', (req, res) => {
    const searchQuery = req.query.search
    const currentUser = req.session.currentUser

    // if user is signed in, search their comic array
    if (currentUser) {
        User.findById(currentUser._id, (err, user) => {
            if (err) {
                console.log(err)
                res.send("An error occurred while searching comics")
            } else {
                const userComics = user.comics
                const searchResults = userComics.filter(comic => comic.title.match(new RegExp(searchQuery, 'i')))
                res.render('searchresults.ejs', {
                    comics: searchResults,
                    currentUser: currentUser
                })
            }
        })
    } else {

        // otherwise search sample comics collection
        Comic.find({ title: { $regex: `${searchQuery}`, $options: 'i' }}, (err, searchResults) => {
            if (err) {console.log(err)}
            else {
                // console.log(searchResults)
                res.render('searchresults.ejs', {
                    comics: searchResults,
                    currentUser: null 
                })
            }
        })
    }
})

// NEW
router.get('/new', authRequired, (req, res) => {
    res.render('new.ejs', { currentUser: req.session.currentUser })
})

// DELETE
router.delete('/:id', authRequired, (req, res) => {

    const comicToDelete = req.params.id
    const currentUser = req.session.currentUser

    // Find user by ID first
    User.findByIdAndUpdate(
        currentUser._id, 
        // pull comic from db array
        { $pull: { comics: { _id: comicToDelete } } },
        // save db after
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.log(err)
                res.send("An error occurred while deleting the comic")
            } else {
                console.log(`Deleted comic with ID ${comicToDelete} from user ${updatedUser.username}`)
                res.redirect('/')
            }
        }
    )
})

// UPDATE
router.put('/:id', authRequired, (req, res) => {

    const currentUser = req.session.currentUser

    if(!currentUser) {
        res.redirect('users/signin')
        return
    }

    User.findById(currentUser._id, (err, user) => {
        if (err) {
            console.log(err)
            res.send("Error fetching user")
        } else if (!user) {
            console.log(`User with id ${currentUser._id} not found`)
            res.send("User not found")
        } else {
            const foundComic = user.comics.find(comic => comic._id.equals(req.params.id))
            if (!foundComic) {
                console.log(`comic with id ${req.params.id} not found`)
                res.send("Comic not found")
            } else {
                // update found comic in user's comic array
                foundComic.title = req.body.title
                foundComic.image = req.body.image
                foundComic.number = req.body.number
                foundComic.volume = req.body.volume
                foundComic.publisher = req.body.publisher
                foundComic.year = req.body.year

                // Save updated information to user
                user.save((err) => {
                    if (err) {
                        console.log(err)
                        res.send('An error occurred while saving the updated comic')
                    } else {
                        console.log('Comic updated successfully:', foundComic)
                        res.redirect('/')
                    }
                })
            }
        }
    })
})

// CREATE
router.post('/', authRequired, (req, res) => {
    // Get user id of logged in user
    const userId = req.session.currentUser._id

    // Create new comic object using the req body
    const newComicData = {
        title: req.body.title,
        image: req.body.image,
        number: req.body.number,
        volume: req.body.volume,
        publisher: req.body.publisher,
        year: req.body.year,
    }

    // Find user by ID and update comics array
    User.findByIdAndUpdate(userId, { $push: { comics: newComicData } }, { new: true }, (err, updatedUser) => {
        if (err) {console.log(err)}
        else {
            console.log(newComicData)
            res.redirect('/')
        }
    })
})

// EDIT
router.get('/:id/edit', authRequired, (req, res) => {

    const currentUser = req.session.currentUser

    if(!currentUser) {
        res.redirect('users/signin')
        return
    }

    User.findById(currentUser._id, (err, user) => {
        if (err) {
            console.log(err)
            res.send("Error fetching user")
        } else if (!user) {
            console.log(`User with id ${currentUser._id} not found`)
            res.send("User not found")
        } else {
            const foundComic = user.comics.find(comic => comic._id.equals(req.params.id))
            if (!foundComic) {
                console.log(`comic with id ${req.params.id} not found`)
                res.send("Comic not found")
            } else {
                res.render('edit.ejs', {
                    comic: foundComic,
                    currentUser: currentUser
                })
            }
        }
    })
})

// SHOW
router.get('/:id', (req, res) => {

    const currentUser = req.session.currentUser

    if (currentUser) {
        User.findById(currentUser._id, (err, user) => {
            if (err) {
                console.log(err)
                res.send("An error has occurred while fetching the comic")
            } else {
                const foundComic = user.comics.find(comic => comic.id === req.params.id)
                if (foundComic) {
                    res.render('show.ejs', {
                        comic: foundComic,
                        currentUser: req.session.currentUser 
                    })
                } else {
                    res.send("Comic not found")
                }
            }
        })
    } else {

        Comic.findById(req.params.id, (err, foundComic) => {
            if (err) {
                console.log(err)
                res.send("An error occured while fetching the comic")
            } else if (!foundComic) {
                // handle 
                res.send("Comic not found")
            } else {
                res.render('show.ejs', {
                    comic: foundComic,
                    currentUser: req.session.currentUser
                })
            }
        })
    }
})



module.exports = router