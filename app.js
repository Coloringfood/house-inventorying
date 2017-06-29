var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config.json');

var debug = require('debug')('house-inventorying:app');

var v1 = require('./routes/v1');
var default_route = require('./routes/default');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * CORS fixing Allowing for anywhere
 */
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', "Content-Type");

    next();
});
app.use(logger(config.logger));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/public/', express.static(path.join(__dirname, 'public')));
app.use('/v1', v1);
app.use('', default_route);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.showMessage = "Page Not found";
    err.status = 404;
    next(err);
});

// error handlers

app.use(function (err, req, res, next) {
    debug('next called: %o', err);
    console.log("Catch all err: ", err);
    var status = (typeof err.status === 'undefined') ? 500 : err.status;
    var unspecifiedErrorMessage = "The server experienced an error, see logs";
    if (typeof err.showMessage === 'undefined') {
        err.showMessage = (typeof err.defaultMessage === 'undefined') ? unspecifiedErrorMessage : err.defaultMessage;
    } else if (err.name == 'UnauthorizedError') {
        err.showMessage = err.message;
    }
    var response = {
        error: err.errors || true,
        message: err.showMessage,
        status: status
    };
    res.status(status)
        .send(response);

    debug('Error: %o', response);
});


module.exports = app;
