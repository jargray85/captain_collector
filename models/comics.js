const { urlencoded } = require('express')
const mongoose = require('mongoose')

const comicSchema = new mongoose.Schema ({
    title: String,
    image: String,
    number: Number,
    volume: Number,
    publisher: String,
    year: Number,
})

const Comic = mongoose.model('Comic', comicSchema)
module.exports = Comic