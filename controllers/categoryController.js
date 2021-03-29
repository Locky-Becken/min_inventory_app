const Product = require('../models/product')
const Category = require('../models/category')
const async = require('async')

exports.category_get_controller = function(req, res, next) {
    async.parallel({
        categories: function(callback) {
            Category.find({})
                .exec(callback)
        },
        products: function(callback) {
            Product.find({})
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if(err) return next(err);
        // console.log(results)
        res.render('category', { categories: results.categories, products: results.products })
    })
}

exports.selected_category_get_controller = function(req, res, next) {
    async.parallel({
        categories: function(callback) {
            Category.find({})
                .exec(callback)
        },
        products: function(callback) {
            Product.find({category: req.params.id})
                .populate('category')
                .exec(callback)
        }
    }, function(err, results) {
        if(err) return next(err);
        // console.log(results)
        res.render('category', { categories: results.categories, products: results.products })
    })
}