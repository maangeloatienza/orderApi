const connection        = require('../config/db').connection;

exports.placeOrder      = (req,res,next)=>{
    let fetchData       = req.body;
    let order           = {};
    let getItem         = `SELECT * FROM products WHERE productId = ?`;
    let itemId          = req.params.productId;
    
    // GET THE SELECTED ITEM
    connection.query(getItem, [itemId],(err,item)=>{
        if(err){
            return res.status(500).json({
                message : 'errorFetchingItem'
            });
        }

        if(item.length>= 1){
            let total = (fetchData.quantity * item[0].price);
            order = {
                productId       : item[0].productId,
                productName     : item[0].productName,
                quantity        : fetchData.quantity,
                price           : item[0].price,
                total           : total
            }

            let checkCart = `SELECT * FROM cart WHERE itemId = ?`;

            connection.query(checkCart,[order.productId],(error,result)=>{
                if(error){
                    return res.status(500).json({
                        message : 'errorCheckingCart'
                    });
                }

                if(result.length <= 0){
                    let addToCart = `INSERT INTO cart   (itemId,item,quantity,price,total)
                                                        VALUES(?,?,?,?,?)`;
                    connection.query(addToCart,[order.productId,order.productName,order.quantity,order.price,order.total],(e,r)=>{
                        if(e){
                            return res.status(500).json({
                                message : 'errorAddingDataToCart'
                            });
                        }
                        
                            res.status(201).json({
                                message : 'addedToCart',
                                data    : r 
                            });
                        
                    }); 
                }else{
                    let updateCart = `UPDATE cart SET quantity = ? , total = ? WHERE itemId = ? `;

                    connection.query(updateCart, [parseInt(result[0].quantity) + parseInt(order.quantity), parseFloat(result[0].total) + parseFloat(order.quantity*order.price),itemId],(er,re)=>{
                        if(er){
                            return res.status(500).json({
                                message : 'errorUpdatingCart'
                            });
                        }

                        res.status(201).json({
                            message     : 'updateCartSuccess',
                            data        : re
                        });
                    });
                }
            });
        }else {
            return res.status(404).json({
                message : 'itemDontExist'
            });
        }
    });

    
};

exports.checkout        = (req,res,next)=>{
    var totalPay        = 0;
    var fetchData       = req.body;
    var content         = [];

    let getCart         = `SELECT * FROM cart`;

    connection.query(getCart,(err,result)=>{
        if(err){
            return res.status(500).json({
                message         : 'errFetchingData'
            });
        }
        let strResult       = JSON.stringify(result);
        
        if(result.length >=1){
            for(var i = 0;i < result.length;i++){
                var id          = result[i].productId
                var item        = result[i].item ;
                var quantity    = result[i].quantity;
                var total       = result[i].total;
                    totalPay    += total; 
                content.push({id: id,item:item, quantity:quantity, total:total});
            }   
            let jsonStr     = JSON.stringify(content);
            let insSales    = `INSERT INTO sales(items,checkoutDate,total) VALUES (?,?,?)`;
            connection.query(insSales, [jsonStr,new Date(),totalPay],(err,sales)=>{
                if(err){
                    return res.status(500).json({
                        message         : 'errCheckingOut',
                        error           : err
                    });
                }
                if(sales.affectedRows >=1){
                    connection.query(`DELETE FROM cart`,(error,response)=>{
                        if(err){
                            message     : 'failedDeletingData'
                        }
                        
                    });
                    res.status(201).json({
                        message         : 'addingDataSucceed',
                        data            : sales
                    });
                }
            }); 
        } else {
            return res.status(404).json({
                message: 'cartEmpty'
            });
        }
            
    });
}; 

