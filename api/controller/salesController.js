const connection        = require('../config/db').connection;


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


