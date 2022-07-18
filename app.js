var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var patientRouter = require('./routes/patient');
var adminRouter = require('./routes/admin');

var app = express();

var db=require('./config/connection');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

db.connect((err)=>{
  if(err) {
  console.log("connection error"+err);
  }
  else {
    console.log("Database connected");
    
  }

})

app.use('/',session({
  name:'homeCookie',
  secret:"Key",
  resave:false,
  saveUninitialized:false,
  cookie:{maxAge:60*60*1000}// 1 hour
}))

app.use('/patient',session({
	name:'patientCookie',
	secret:"Key",
	resave:false,
	saveUninitialized:false,
	cookie:{maxAge:24*60*60*1000}
}))

app.use('/admin',session({
	name:'adminCookie',
	secret:"Key",
	resave:false,
	saveUninitialized:false,
	cookie:{maxAge:24*60*60*1000}
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/patient', patientRouter);
app.use('/admin', adminRouter);

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

module.exports = app;
