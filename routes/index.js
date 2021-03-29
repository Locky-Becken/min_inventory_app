var express = require('express');
var router = express.Router();
const HomeController = require('../controllers/homeController')
const ProductController = require('../controllers/productController')


/* GET home page. */
router.get('/', HomeController.index_get_controller);

router.get('/add', HomeController.index_get_form_controller)

router.post('/add', HomeController.index_post_form_controller)

router.get('/add/:id', ProductController.product_update_controller)

router.post('/add/:id', ProductController.product_update_post_controller)

module.exports = router;
 