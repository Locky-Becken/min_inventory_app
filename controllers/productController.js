const Product = require('../models/product')
const Category = require('../models/category')
const Color = require('../models/color')
const async = require('async')
const { body, validationResult } = require('express-validator')

exports.product_get_controller = function(req, res, next) {
    
    Product.findById(req.params.id)
        .populate('color')
        .exec(function (err, product) {
            if(err) return next(err);
            res.render('product', {product: product, colors: product.color})
        })
}

exports.product_delete_controller =  function(req, res, next) {
    // console.log(req.body.productid)
    Product.findByIdAndRemove(req.body.productid, function(err) {
        if(err) return next(err);
        res.redirect('/category')
    })
}

exports.product_update_controller = function(req, res, next) {
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).populate('category').exec(callback)
        },
        categories: function(callback) {
            Category.find({}).exec(callback)
        },
        colors: function(callback) {
            Color.find({}).exec(callback)
        }
    }, function(err, results) {
        if(err) return next(err)
        
        for(let i = 0; i < results.colors.length ; i++) {
            let color = results.colors[i]
            if(results.product.color?.indexOf(color._id) > -1) results.colors[i].checked = true;
            console.log(results.product.color?.indexOf(color._id) > -1)
            // else results.colors[i].checked = false;
        }
        res.render('product_form', {product: results.product, categories: results.categories, colors: results.colors})
    })
    
}

exports.product_update_post_controller =[
    (req, res, next) => {
        if(!(req.body.color instanceof Array)) {
            req.body.color = new Array(req.body.color);
        }
        next()
    },
    body('name', 'Name must not be empty').trim().isLength({min: 1}).escape(),
    body('price', 'Price must not be empty').trim().isLength({min: 1}).escape(),
    body('color.*').escape(),
    (req, res, next) => {
        // console.log(req.body.price)
        const errors = validationResult(req)
        // console.log(errors)
        
        const prod = new Product({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            color: req.body.color,
            _id: req.params.id
        })
    
        if(!errors.isEmpty()) {
            async.parallel({
                product: function(callback) {
                    Product.findById(req.params.id).populate('category').exec(callback)
                },
                categories: function(callback) {
                    Category.find({}).exec(callback)
                },
                colors: function(callback) {
                    Color.find({}).exec(callback)
                }
            }, function(err, results) {
                if(err) return next(err)
                console.log(results.colors[0].checked)
                res.render('product_form', { product: results.product, categories: results.categories, colors: results.colors, errors: errors.array() });
            })
            return;
        }else {
            // console.log(req.body)
            Product.findByIdAndUpdate(req.params.id, prod, {}, (function(err, product){
                if(err) return next(err)
                res.redirect(product.url)
            }))
        }
    }
]

