const express = require('express');
const path = require('path');

{{#each routes}}
const {{@key}}Router = require('./{{@key}}/{{@key}}.route.js')();
{{/each}}

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//register routes
{{#each routes}}
app.use('{{normalizePath ../basePath}}/{{@key}}', {{@key}}Router);
{{/each}}

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
