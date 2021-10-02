// dependency imports
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const publishersRoute = require('./api/routes/publishersRoute');

// create app instance
const app = express();

// setup mongoose database
mongoose.connect('mongodb+srv://akeem_aweda:RUp9RFGSzb!vPw5@cluster0.oyj5o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;

// configure middleware
app.use(morgan('dev')); // for logging 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// handle cors
app.use((request, response, next) => {    
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content Type, Accept, Authorization');
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST');    // allow only POST requests
        response.status(200).json({});  // request granted successfully
    }
    next();
});

// handle incoming requests
app.use('/', publishersRoute);

// handle errors
app.use((request, response, next) => {  // 404
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, request, response, next) => {   // 404 or 500 error
    response.status = error.status || 5000;
    response.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;