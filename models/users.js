const mongoose = require('mongoose')

const comicsSchema = new mongoose.Schema({
    title: String,
    image: String,
    number: Number,
    volume: Number,
    publisher: String,
    year: Number,
})

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    comics: [comicsSchema]
})

const User = mongoose.model('User', userSchema)

module.exports = User