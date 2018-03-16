const express       = require('express');
const router        = express.Router();

const orderCtrl     = require('../controller/orderController');
const prodCtrl      = require('../controller/productController');
const salesCtrl     = require('../controller/salesController');


router.get('/products', prodCtrl.getProducts);
router.get('/products/:productId', prodCtrl.getProductById);
router.post('/products', prodCtrl.addProduct);

router.post('/addToCart/:productId', orderCtrl.placeOrder);
router.post('/checkout', orderCtrl.checkout);

router.get('/sales/record', salesCtrl.getSales);
router.post('/sales/date', salesCtrl.getSalesByDate);
router.get('/sales/:salesId', salesCtrl.getSalesById);
router.delete('/sales/delete/:salesId', salesCtrl.deleteSales);

module.exports = router;