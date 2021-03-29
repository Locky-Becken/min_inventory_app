const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema ({
    name: {type: String, required: true, maxlength: 100},
    price: {type: Number, required: true},
    color: [{type: Schema.Types.ObjectId, ref: 'Color', required: true}],
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true}
})

ProductSchema
.virtual('price_formatted')
.get(function() {
    return this.price.toFixed(2)
})

ProductSchema
.virtual('url')
.get(function () {
    return '/shop/' + this._id;
})

module.exports = mongoose.model('Product', ProductSchema)