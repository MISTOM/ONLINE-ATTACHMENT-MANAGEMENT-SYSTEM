const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const expressMessages = require("express-messages")

const passport = require("passport");

//EXPRESS INIT
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: "tomSess",
    secret: "80808080",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }//one hr
  })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next){
  res.locals.message = expressMessages;
  next();
});
const indexRouter = require("./routes/index");
const dashboard = require("./routes/dashboard");


app.use("/", indexRouter);
app.use("/dashboard", dashboard);

/**==pdf generation============================*/


// catch 404//
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler//'
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
