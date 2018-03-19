const connection        = require('../config/db').connection;
const bcrypt            = require('bcrypt');
const jwt               = require('jsonwebtoken');
process.env.JWT_TOKEN = 'secret';


function checkEmail(email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
}


/**
 * @api {post} /user/register Get information for login
 * @apiName register
 * @apiGroup user
 *
 * @apiSuccess {Int}    userId ID of the user.
 * @apiSuccess {String} firstName First name of the user.
 * @apiSuccess {String} lastName Last name of the user.
 * @apiSuccess {email}  email  Email address of the user.
 * @apiSuccess {password}    password  Hashed password of the user.
 */

exports.register           = (req,res,next)=>{

    let password        = req.body.password;
    let users           = [];
    
    bcrypt.hash(password,10,(err,hash)=>{
        if(err){
            error :  err;
        }
        users = {
            firstName   : req.body.firstName,
            lastName    : req.body.lastName,
            email       : req.body.email,
            password    : hash
        }
            
    
        connection.query(`SELECT * FROM users WHERE email = ?`,[users.email],(err,result)=>{
            if(err){
                return res.status(500).json({
                    message     : 'errorAuthentication',
                    error       : err
                });
            }
            if(result.length>=1){
                res.status(403).json({
                    message     : 'userAlreadyExists',
                    error       : err
                });
            }else{
                connection.query(`INSERT INTO users(firstName,lastName,email,password) VALUES(?,?,?,?)`,[users.firstName,users.lastName,users.email,users.password],(error,data)=>{
                    if(error){
                        return res.status(500).json({
                            message         : 'errorAuthenticatingData',
                            error           : error
                        });
                    }

                    res.status(201).json({
                        message         : 'createdSuccessfully',
                        data            : data,
                        success         : true
                    })
                });

            }
        });
    });
};


/**
 * @api {post} /user/login Fetch user information to login
 * @apiName login
 * @apiGroup user
 *
 * @apiSuccess {Int}    userId ID of the user.
 * @apiSuccess {String} firstName First name of the user.
 * @apiSuccess {String} lastName Last name of the user.
 * @apiSuccess {email}  email  Email address of the user.
 * @apiSuccess {password}    password  Hashed password of the user.
 * @apiSuccess {token}  token Token for authenticating and limiting access throughout the routes
 */

exports.login           = (req,res,next)=>{
    connection.query(`SELECT * FROM users WHERE email = ?`,[req.body.email],(err,result)=>{
        if(err){
            return res.status(500).json({
                message     : 'errLoggingIn',
                error       : err
            });
        }

        if(result.length <=0){
            res.status(404).json({
                message     : 'usernameNotFound',
                error       : err
            });
        }else {
            bcrypt.compare(req.body.password,result[0].password,(error,confirm)=>{
                if(error){
                    return res.status(401).json({
                        message     :'errorAuthenticatingAccount',
                        error       : error
                    }); 
                }

                if(confirm){
                    const token = jwt.sign({
                        email       : result[0].email,
                        password    : result[0].password
                    },process.env.JWT_TOKEN,{
                        expiresIn   : '7d'
                    });

                    res.status(200).json({
                        message     : 'loggedInSuccess',
                        data        : result,
                        token       : token,
                        success     : true
                    });
                }
            });
        }
    });
};
