const Product = require('../models/product')

exports.shop_get_controller = function(req, res, next) {
    Product.find({}).populate('color')
        .exec(function(err, products) {
            if(err) return next(err)
            res.render('shop', {products: products})
        })
}