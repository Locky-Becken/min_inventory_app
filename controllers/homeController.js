const Product = require('../models/product')
const Color = require('../models/color')
const Category = require('../models/category')
const async = require('async')
const { body, validationResult } = require('express-validator')

exports.index_get_controller = function(req, res, next) {
    async.series([

        function(callback){
            Category.find({}).exec(callback)
        },

        function(callback) {
            Color.find({}).exec(callback)
        },
        function(callback) {
            Product.find({})
                .populate('color')
                .populate('category')
                .exec(function(err, list_products) {
                    if(err) return next(err)
                    // console.log(list_products)
                    res.render('index', { products: list_products });
                })
        }
    ])
    
        
} 

exports.index_get_form_controller = function(req, res, next) {
    async.parallel({
        categories: function(callback) {
            Category.find({}).exec(callback)
        },
        colors: function(callback) {
            Color.find({}).exec(callback)
        }
    }, function(err, results) {
        if(err) return next(err)
        
        // console.log(results.colors[0].checked)
        res.render('product_form', { product: undefined, categories: results.categories, colors: results.colors });
    })
    
}

exports.index_post_form_controller =[

    (req, res, next) => {
        if(!(req.body.color instanceof Array)) {
            req.body.color = new Array(req.body.color);
        }
        next()
    },
    body('name', 'Name must not be empty').trim().isLength({min: 1}).escape(),
    body('color.*').escape(),
    (req, res, next) => {
        console.log(req.body.price)
        const errors = validationResult(req)
        console.log(errors)
        
        const prod = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            color: req.body.color
        })

        if(!errors.isEmpty()) {
            async.parallel({
                categories: function(callback) {
                    Category.find({}).exec(callback)
                },
                colors: function(callback) {
                    Color.find({}).exec(callback)
                }
            }, function(err, results) {
                if(err) return next(err)
                console.log(results.colors[0].checked)
                res.render('product_form', { product: undefined, categories: results.categories, colors: results.colors, errors: errors.array() });
            })
        }else {
            // console.log(req.body)
            prod.save(function(err){
                if(err) return next(err)
                res.redirect(prod.url)
            })
        }
    }
] 

// [
//     (req, res, next) => {
//         if(req.body.color === 'undefined') req.body.genre = []
//         else req.body.color = new Array(req.body.color)
//     }, body('name', 'Name must not be empty').trim().isLength({min: 1}).escape(),
//     (req, res, next) => {
//         const errors = validationResult(req)

//         const prod = new Product({
//             name: req.body.name,
//             price: req.body.price,
//             category: req.body.category,
//             color: req.body.category
//         })

//         if(!errors.isEmpty()) {
//             async.parallel({
//                 categories: function(callback) {
//                     Category.find({}).exec(callback)
//                 },
//                 colors: function(callback) {
//                     Color.find({}).exec(callback)
//                 }
//             }, function(err, results) {
//                 if(err) return next(err)
//                 console.log(results.colors[0].checked)
//                 res.render('product_form', { product: undefined, categories: results.categories, colors: results.colors, errors: errors.array() });
//             })
//         }else {
//             console.log(req.body)
//             prod.save(function(err){
//                 if(err) return next(err)
//                 res.redirect(prod.url)
//             })
//         }
//     }
// ]

// // module.exports = {index_get_controller}