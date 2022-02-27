var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const session = require('express-session')


var router = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(cors(
    {
        origin: "http://localhost:3000", // <--- port of front-end "http://localhost:3000" 
        credentials: true
    }
))

app.use((err, req, res, next) => {

    res.json({
        status: err.status || 500,
        message: err.message
    })

})

router(app);





module.exports = app;
