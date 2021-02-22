const express = require("express");

const conn = require("../lib/db");
const passport = require("passport");
const passportLocal = require("passport-local");
const { json } = require("body-parser");
const { response } = require("express");
// const { control } = require("../controllers/routeControll");

const router = express.Router();

//______________________________________________________________________
function control(req, res, next) {
  if (req.user == "undefined" || req.user == undefined) {
    return next()
  } else {
    if (req.user.role_id === 1) {
      res.redirect('/dashboard/admin');
    } else if (req.user.role_id === 2) {
      res.send(`the supervisor ${req.user.first_name} will be redirected to the supv. page.`)
    } else {
      res.redirect('/dashboard');
    }
  }
}
//______________________________________________________________________

/*-----------------------------------ROUTES-- */
router.get("/", control, function (req, res, next) {
  res.render("index", {
    title: "LOGIN",
    messages: req.flash('loginMessage')
  });
});

/*----------------------------------------LOGIN AUTH----------------------- */
let LocalStrategy = passportLocal.Strategy;

router.post("/authentication",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    successFlash: true,
    failureFlash: true,
    passReqToCallback: true
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
    (username, password, done) => {
      // callback with username and password from the form

      conn.query("SELECT * FROM users WHERE username =?", username,
        (err, rows) => {
          if (err) return done(err);
          if (!rows.length) {
            return done(null, false, { message: "No user found." });
          }
          ///////////////USER FOUND WRONG PASSWORD///////////////////
          if (!(rows[0].password == password)) {
            return done(null, false, { message: "Oops! Wrong password." });
          } else {
            return done(null, rows[0]);
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  conn.query(
    `SELECT * FROM users us INNER JOIN user_profiles up ON us.user_id = ${id} AND up.user_id = ${id} LEFT JOIN institution_info insf ON insf.student_id =${id} LEFT JOIN institution_supervisor insv ON insv.institution_id=insf.institution_id LEFT JOIN programme prg ON prg.programme_id = up.programme_id LEFT JOIN departments dept ON dept.department_id = prg.department_id LEFT JOIN school ON school.school_id = dept.school_id `,
    (err, rows) => {
      console.log(`DESERIALIZED USER HERE: ${rows[0]}`)
      done(null, rows[0]);
    }
  );
});

module.exports = router;
