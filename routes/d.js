const express = require("express");
const router = express.Router();
const conn = require("../lib/db.js");
// const flash = require('express-flash');

function isAdmin(req, res, next) {
  if (req.user.is_admin) {
    console.log("rendering admin view........");
    res.redirect("/d/admin");
  } else {
    return next();
  }
}

function reqProcess(req, res, next) {
  console.log("request process running......");
  if (req.user.is_requested) {
    //already requested
  } else if (req.user.is_approved) {
    //user is already approved no need
  } else if (req.user.is_attached) {
    //user is already attached
  } else {
    return conn.query(
      `UPDATE persons SET is_requested = 1 WHERE user_id = ${req.user.user_id}`
    );
  }
  next();
}

//------------------ROUTES--------------------
router.get("/", isAdmin, (req, res, next) => {
  console.log("donnnnnnne");
  res.render("d", {
    NAME: req.user.f_name,
  });
});

router.get("/admin", (req, res, next) => {
  console.log("In Admin");
  res.render("admin", {
    NAMEofADMIN: req.user.f_name,
  });
});

router.get("/request", reqProcess, (req, res, next) => {
  console.log(req.user.f_name, "has requested!!!");
  next();
});

module.exports = router;
