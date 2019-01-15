const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
//const logger = require('morgan');

const servicesRouter = require('./services/services.route.js')();

var app = express();

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.bodyParser());
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//register routes
app.use('/api/services', servicesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
     next({
         status : 404,
         message : "resource not found"
     });
});

// error handler
app.use(function(err, req, res, next) { console.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // send error
    if(err.message)res.status(err.status || 500).send(err.message);
    else res.sendStatus(err.status || 500);
});

module.exports = app;
