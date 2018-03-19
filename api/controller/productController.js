const connection        = require('../config/db').connection;

/**
 * @api {get} /products Request Products
 * @apiName getProducts
 * @apiGroup products
 *
 * @apiSuccess {String} productName Name of the product.
 * @apiSuccess {Text} productImage Image of the product.
 * @apiSuccess {Float}  price  Cost of each product.
 * @apiSuccess {Int}    quantity  Number of items.
 */

exports.getProducts     = (req,res,next)=>{
        let getQuery    = `SELECT * FROM products`;
        
        connection.query(getQuery,(err,result)=>{
            if(err){
                return res.status(500).json({
                    message         : 'errFetchingData'
                });
            }

            res.status(200).json({
                message         : 'fetchingDataSucceed',
                data            : result
            });
        });
};

/**
 * @api {get} /products/:productId Request Products
 * @apiName getProducts
 * @apiGroup getProductById
 *
 * @apiParam {productId} id Products unique ID.
 *
 * @apiSuccess {String} productName Name of the product.
 * @apiSuccess {Text} productImage Image of the product.
 * @apiSuccess {Float}  price  Cost of each product.
 * @apiSuccess {Int}    quantity  Number of items.
 */

exports.getProductById  = (req,res,next)=>{
        let productId   = req.params.productId
        let getQuery    = `SELECT * FROM products WHERE productId = ${productId}`;

        connection.query(getQuery,(err,result)=>{
            if(err){
                return res.status(500).json({
                    message         : 'errFetchingData'
                });
            }

            if(result.length >=1){
                return res.status(200).json({
                    message         : 'fetchingDataSucceed',
                    data            : {
                        id          : result[0].productId,
                        productName : result[0].productName,
                        productImage: result[0].productImage,
                        price       : result[0].price,
                        quantity    : result[0].quantity
                    } 
                });
            }else {
                return res.status(404).json({
                    message         : 'dataNotFound'
                })
            }
            
        });
};

/**
 * @api {post} /products Request Products
 * @apiName addProduct
 * @apiGroup products
 *
 * @apiSuccess {String} productName Name of the product.
 * @apiSuccess {Text} productImage Image of the product.
 * @apiSuccess {Float}  price  Cost of each product.
 * @apiSuccess {Int}    quantity  Number of items.
 */

exports.addProduct      = (req,res,next)=>{
        let product     = {};
        let fetchData   = req.body;
        let chkquery    = `SELECT * FROM products WHERE productName = ?`;

        connection.query(chkquery,[fetchData.productName],(err,result)=>{
            if(err){
                return res.status(500).json({
                    message     : 'errFetchingData'
                });
            }
            if(result.length>=1){
                return res.status(200).json({
                    message     : 'dataAlreadyExists'
                });
            }else {
                product     = {
                    productName     : fetchData.productName,
                    price           : fetchData.price,
                    quantity        : fetchData.quantity,
                    image           : req.file.filename
                };

                let insProd = `INSERT INTO products(productName,productImage,price,quantity) VALUES(?,?,?,?)`;

                connection.query(insProd,[product.productName,product.image,product.price,product.quantity],(err,product)=>{
                    console.log(req.file);
                    
                    if(err){
                        return res.status(500).json({
                            message         : 'errAddingData'
                        });
                    }
                    if(product.affectedRows >=1){
                        return res.status(201).json({
                            message         : 'dataAddedSuccessfully',
                            data            : product
                        });
                    }
                });
            }
        });


};

/**
 * @api {delete} /products/delete/:productId Request Products
 * @apiName deleteProduct
 * @apiGroup products
 *
 * @apiSuccess {String} Success message.
 */

exports.deleteProduct    = (req,res,next)=>{
    let id               = req.params.productId;
    let deleteQuery      = `DELETE FROM products WHERE productId = ${id}`;

    connection.query(deleteQuery,(err,result)=>{
        if(err){
            return res.status(500).json({
                message     : 'errorFetchingData'
            });
        }
        if(result.affectedRows > 0){
            res.status(200).json({
               message      : 'dataDeletedSuccessfully',
               dataDeleted  : id 
            });
        }else {
            return res.status(404).json({
                message     : 'itemDoesNotExist'
            });
        }
    });  
};