const express = require("express");
const conn = require("../lib/db");
const passport = require("passport");
const passportLocal = require("passport-local");

const router = express.Router();

//______________________________________________________________________
function control(req, res, next) {
  if (req.user === undefined) {
    return next()
  } else {
    if (req.user.role_id === 1) {
      res.redirect('/dashboard/admin');
    } else if (req.user.role_id === 2) {
      res.redirect('/dashboard/supervisor')
    } else {
      res.redirect('/dashboard');
    }
  }
}
//______________________________________________________________________

/*-----------------------------------ROUTES-- */
router.get("/", control, (req, res, next) => {
  res.render("index", {
    title: "LOGIN",
  });
});

/*_____________________________________________LOGIN AUTHENTICATION______________________________*/
let LocalStrategy = passportLocal.Strategy;

router.post("/authentication",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true
  })
);

//------------------------PASSPORT CONFIG---
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      // passReqToCallback: true //pass to cb
    },
    (username, password, done) => {
      // callback with username and password from the form

      conn.query("SELECT * FROM users WHERE username =?", username,
        (err, rows) => {
          if (err) return done(err);
          if (!rows.length) {
            return done(null, false, { message: "Incorrect Username or Password! Please try again." });
          }
          ///////////////USER FOUND WRONG PASSWORD///////////////////
          if (!(rows[0].password == password)) {
            return done(null, false, { message: "Incorrect password! Please try again." });
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
      if (err) return done(err)
      // console.log(rows)
      done(null, rows[0]);
    }
  );
});

module.exports = router;
