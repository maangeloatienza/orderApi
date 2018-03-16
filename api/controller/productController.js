const connection        = require('../config/db').connection;

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
                    quantity        : fetchData.quantity
                };

                let insProd = `INSERT INTO products(productName,price,quantity) VALUES(?,?,?)`;

                connection.query(insProd,[product.productName,product.price,product.quantity],(err,product)=>{
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