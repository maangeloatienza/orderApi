
const express       = require('express');
const router        = express.Router();
const multer        = require('multer');

const orderCtrl     = require('../controller/orderController');
const prodCtrl      = require('../controller/productController');
const salesCtrl     = require('../controller/salesController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename    : (req,file,cb)=>{
        cb(null,  file.originalname);
    } 
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


const upload = multer({
    storage : storage,
    limit   : {
        fileSize    : 1024*1024*5
    },
    fileFilter  : fileFilter
});


//router.get(express.static('./uploads'));


router.get('/products', prodCtrl.getProducts);
router.get('/products/:productId', prodCtrl.getProductById);
router.post('/products', upload.single('productImage'),prodCtrl.addProduct);
router.delete('/products/delete/:productId', prodCtrl.deleteProduct);

router.post('/order/addToCart/:productId', orderCtrl.placeOrder);
router.post('/order/checkout', orderCtrl.checkout);

router.get('/sales/record', salesCtrl.getSales);
router.post('/sales/date', salesCtrl.getSalesByDate);
router.get('/sales/record/:salesId', salesCtrl.getSalesById);
router.delete('/sales/delete/:salesId', salesCtrl.deleteSales);

module.exports = router;