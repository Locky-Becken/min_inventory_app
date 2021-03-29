const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')


router.get('/', categoryController.category_get_controller)

router.get('/:id', categoryController.selected_category_get_controller)
module.exports = router