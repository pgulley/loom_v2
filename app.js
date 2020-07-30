var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var session = require('express-session')({
    secret: "temp-secret",
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  })

var logger = require('morgan');
var http = require('http')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '500mb' }));
app.use(cookieParser());
app.use(bodyParser.json({limit: '500mb'}));
app.use(session)
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
var io = require('socket.io')(server);
var sharedsession = require("express-socket.io-session")(session)
io.use(sharedsession)

var indexRouter = require('./routes/index')(io, sharedsession);
var twineRouter = require('./routes/twines')(io, sharedsession);

app.use('/', indexRouter);
app.use('/tw', twineRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(6969, function(){
	console.log("App running ")
})
