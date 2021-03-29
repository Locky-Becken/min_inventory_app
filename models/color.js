const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ColorSchema = new Schema({
    name: {type: String, required: true}
})

module.exports = mongoose.model('Color', ColorSchema)