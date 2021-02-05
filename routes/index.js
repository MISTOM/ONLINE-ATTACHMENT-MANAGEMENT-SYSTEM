const express = require("express");

const conn = require("../lib/db");
// const flash = require('express-flash');
const passport = require("passport");
const passportLocal = require("passport-local");

const router = express.Router();

//______________________________________________________________________
function control(req, res, next) {
  if(req.user == "undefined" || req.user == undefined){
    return next()
  }else{
    if (req.user.is_admin) {
      res.redirect('/d/admin');
    } else {
      res.redirect('/d');
    }
  }
}

//______________________________________________________________________

/*-----------------------------------ROUTES-- */
router.get("/",control, function (req, res, next) {
  res.render("index", {
    title: "LOGIN"
  });
});

///////////////////LOGIN AUTH//////////////////////////
let LocalStrategy = passportLocal.Strategy;

router.post(
  "/authentication",
  passport.authenticate("local", {
    successRedirect: "/d",
    failureRedirect: "/",
    successFlash: true,
    failureFlash: true,
  })
);

//------------------------PASSPORT CONFIG---
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      // passReqToCallback : true //pass to cb
    },
    function (username, password, done) {
      // callback with username and password from the form

      conn.query("SELECT * FROM persons WHERE username =?",username,
        function (err, rows) {
          if (err) return done(err);
          if (!rows.length) {
            return done(null, false, { error: "No user found." });
          }
          //         |||///////////////USER FOUND WRONG PASSWORD///////////////////
          if (!(rows[0].password == password)) {
            return done(null, false, { error: "Oops! Wrong password." });
          } else {
            return done(null, rows[0]);
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("user here", user);
  done(null, user.user_id);
});

passport.deserializeUser(function (id, done) {
  conn.query(
    "SELECT * FROM persons WHERE user_id =?",id,
    function (err, rows) {
      done(null, rows[0]);
    }
  );
});

module.exports = router;
