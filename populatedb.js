#! /usr/bin/env node

console.log('This script populates some test products, categories and colors to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const async = require('async')
const Color = require('./models/color')
const Product = require('./models/product')
const Category = require('./models/category')

const mongoose = require('mongoose')
const mongoDB = userArgs[0]
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

let colors = []
let products = []
let categories = []

function colorCreate(name, cb) {
    const color = new Color({
        name: name
    })
    color.save(function(err) {
        if(err) {
            cb(err, null)
            return;
        }
        console.log('New Color', color)
        colors.push(color)
        cb(null, color)
    })
}

function categoryCreate(name, cb) {
    const category = new Category({
        name: name
    })
    category.save(function(err) {
        if(err) {
            cb(err, null)
            return;
        }
        console.log('New Category', category)
        categories.push(category)
        cb(null, category)
    })
}

function productCreate(name, price, color, category, cb) {
    productDetail = {
        name: name,
        price: price,
        color: color,
        category: category
    }

    // if(color != false) productDetail.color = color

    const product = new Product(productDetail)

    product.save(function(err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Product ' + product)
        products.push(product)
        cb(null, product)
    })
}

function createCategoriesColors(cb) {
    async.series([
        function(callback ) {
            colorCreate('#C0392B', callback)
        },
        function(callback ) {
            colorCreate('#2980B9', callback)
        },
        function(callback) {
            colorCreate('#1E8449', callback)
        }, 
        function(callback) {
            colorCreate('#FDFEFE', callback)
        },
        function(callback) {
            colorCreate('#17202A', callback)
        },
        function(callback) {
            categoryCreate('Shoes', callback)
        },
        function(callback) {
            categoryCreate('Jackets', callback)
        },
        function(callback) {
            categoryCreate('Eletronics', callback)
        }
    ], cb)
}

function createProduct(cb) {
    async.parallel([
        function(callback) {
            productCreate('Nike Air', 125, [colors[1]], categories[0], callback)
        },
        function(callback) {
            productCreate("Women's Classic Utility Jacket", 125, [colors[1]], categories[1], callback)
        },
        function(callback) {
            productCreate("Invicta Two-Tone Automatic Watch", 100, [colors[3]], categories[2], callback)
        }
    ], cb)
}

async.series([
    createCategoriesColors,
    createProduct
],
    function(err, results) {
        if(err) {
            console.log('FINAL ERR', +err)
        }else {console.log('Products: ' +products)}
        mongoose.connection.close();

    }
)

