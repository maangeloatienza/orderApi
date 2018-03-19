const connection        = require('../config/db').connection;

/**
 * @api {get} /sales/record Retrieve all successful sales
 * @apiName getSales
 * @apiGroup sales
 *
 * @apiSuccess {Int}    id Sales ID of the the order.
 * @apiSuccess {String} items Consists of Item name, quantity, total
 * @apiSuccess {String} item Name of the item ordered.
 * @apiSuccess {Int}    quantity Number of item/s ordered.
 * @apiSuccess {Float}  total  Amount of ordered item price multiplied to quantity.
 * @apiSuccess {Float}  total  Total of all items ordered.
 */



exports.getSales            = (req,res,next)=>{
    let getSales            = `SELECT * FROM sales`;

    connection.query(getSales,(err,result)=>{
        if(err){
            return res.status(500).json({
                message     : 'retrievingSalesError'
            });
        }
        var parsedObj = [];
        for (var i in result) {
            var samp = JSON.parse(result[i].items);

            parsedObj.push({ id: result[i].salesId, items: samp, date: result[i].dateout, time: result[i].timeout, total: result[i].total });

        }

        res.status(200).json({
            message         : 'dataRetrievedSuccessfully',
            data            : parsedObj     
        });
    });
};

/**
 * @api {get} /sales/record/: Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {salesId} id Unique ID for a specific sale.
 *
 * @apiSuccess {Int}    id Sales ID of the the order.
 * @apiSuccess {String} items Consists of Item name, quantity, total
 *      @apiSuccess {String} item Name of the item ordered.
 *      @apiSuccess {Int}    quantity Number of item/s ordered.
 *      @apiSuccess {Float}  total  Amount of ordered item price multiplied to quantity.
 * @apiSuccess {Float}  total  Total of all items ordered..
 */


exports.getSalesById = (req, res, next) => {
    let getIdQuery = `SELECT * FROM sales WHERE salesId = ${req.params.salesId}`;

    connection.query(getIdQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'errorFetchingData'
            });
        }

        if (result.length >= 1) {

            var parsedObj = [];
                var samp = JSON.parse(result[0].items);

                parsedObj.push({ id: result[0].salesId, items: samp, date: result[0].dateout, time: result[0].timeout, total: result[0].total });

            res.status(200).json({
                message : 'fetchingDataSuccess',
                data    : parsedObj
            });
        } else {
            res.status(404).json({
                message: 'dataNotFound'
            });
        }
    });
};

/**
 * @api {post} /sales/date Retrieve sales from a specific timeframe
 * @apiName getSalesById
 * @apiGroup sales
 *
 * @apiSuccess {Int}    id Sales ID of the the order.
 * @apiSuccess {String} items Consists of Item name, quantity, total
 *      @apiSuccess {String} item Name of the item ordered.
 *      @apiSuccess {Int}    quantity Number of item/s ordered.
 *      @apiSuccess {Float}  total  Amount of ordered item price multiplied to quantity.
 * @apiSuccess {Float}  total  Total of all items ordered.
 */




exports.getSalesByDate = (req, res, next) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let time_s = '00:00:00';
    let time_e = '23:59:59';

    let compareDate = `SELECT salesId,items,DATE(checkoutDate) AS dateout,TIME(checkoutDate) AS timeout,total FROM sales WHERE DATE(checkoutDate) BETWEEN ?  AND ? AND TIME(checkoutDate) BETWEEN ? AND ?`;

    connection.query(compareDate,[startDate,endDate,time_s,time_e] ,(err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'errorFetchingSales'
            });
        }
        var parsedObj = [];
        for(var i in result){
            var samp = JSON.parse(result[i].items);

            parsedObj.push({ id: result[i].salesId, items: samp, date: result[i].dateout, time : result[i].timeout, total: result[i].total});

        }
        res.status(201).json( {
            data :  parsedObj
        });

    });
};

/**
 * @api {delete} /sales/delete/:salesId Retrieve all successful sales
 * @apiName deleteSales
 * @apiGroup sales
 *
 * @apiSuccess {Int}    id Sales ID of the the deleted order.
 * @apiSuccess {String} message prompt a message that the specific sales record is deleted
 */


exports.deleteSales = (req, res, next) => {

    let salesId = req.params.salesId;
    let delQuery = `DELETE FROM sales WHERE salesId = ${salesId}`;

    connection.query(delQuery, (err, result) => {
        if (err) {
            return res.status(500).json({
                message     : 'errDeletingData'
            });
        }
        if (result.affectedRows >= 1) {
            return res.status(200).json({
                message     : 'deletingDataSucceed',
                deletedId   : orderId
            });
        } else {
            return res.status(404).json({
                message     : "orderIdNotFound"
            });
        }
    });
};


