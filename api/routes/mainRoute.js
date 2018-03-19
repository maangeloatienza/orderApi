
const express       = require('express');
const router        = express.Router();
const multer        = require('multer');

const orderCtrl     = require('../controller/orderController');
const prodCtrl      = require('../controller/productController');
const salesCtrl     = require('../controller/salesController');
const userCtrl      = require('../controller/userController');

const checkauth     = require('../middleware/checkauth');

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

router.post('/users/register', userCtrl.register);
router.post('/users/login',userCtrl.login);


router.get('/products', checkauth, prodCtrl.getProducts);
router.get('/products/:productId', checkauth, prodCtrl.getProductById);
router.post('/products', checkauth, upload.single('productImage'),prodCtrl.addProduct);
router.delete('/products/delete/:productId', checkauth, prodCtrl.deleteProduct);

router.post('/order/addToCart/:productId', orderCtrl.placeOrder);
router.post('/order/checkout', orderCtrl.checkout);

router.get('/sales/record', checkauth, salesCtrl.getSales);
router.post('/sales/date', checkauth, salesCtrl.getSalesByDate);
router.get('/sales/record/:salesId', checkauth, salesCtrl.getSalesById);
router.delete('/sales/delete/:salesId',checkauth, salesCtrl.deleteSales);

module.exports = router;