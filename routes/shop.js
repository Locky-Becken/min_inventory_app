const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const shopController = require('../controllers/shopController')

router.get('/', shopController.shop_get_controller)

router.get('/:id', productController.product_get_controller)

router.post('/:id', productController.product_delete_controller)

module.exports = router;