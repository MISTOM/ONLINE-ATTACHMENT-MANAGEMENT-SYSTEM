const createError = require("http-errors")
  , express = require("express")
  , path = require("path")
  , cookieParser = require("cookie-parser")
  , logger = require("morgan")
  , bodyParser = require("body-parser")
  , flash = require("express-flash")
  , session = require("express-session")
  , expressMessages = require("express-messages")
  , dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");

//EXPRESS INIT
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("80808080"));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());
app.use(
  session({
    name: "O A M S",
    secret: "80808080",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }//one hr
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.message = expressMessages;
  next();
});

/**MODULES================================================ */
const indexRouter = require("./routes/index");
const dashboard = require("./routes/dashboard");
const API = require("./API/alpha");

app.use("/", indexRouter);
app.use("/dashboard", dashboard);


/**API ROUTE =============================================*/
app.use("/api", API)
/**======================================================= */

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