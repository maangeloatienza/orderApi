const express       = require('express');
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const orderRouter   = require('./api/routes/mainRoute');

const app           = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Authorization');
    res.header('Content-Type','application/json');
    next();

});
app.use('/uploads',express.static('uploads'));
app.use('/',orderRouter);

//192.168.1.145/24

app.listen(3737,()=>{
    console.log('Server Running');
});
module.exports = app;