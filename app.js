const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const d = require('./routes/d');

const passport = require('passport');
//EXPRESS INIT
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  name:'tomSess',
  secret: '80808080',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//==============================//
// app.use((req, res, next)=>{
//   console.log(req.user);
//   next();
// })


app.use('/', indexRouter);
app.use('/d', d);



// catch 404//
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler//'
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;