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

// function reqProcess(req, res, next) {
//   console.log("request process running......");
//   if (req.user.is_requested) {
//     //already requested
//   } else if (req.user.is_approved) {
//     //user is already approved no need
//   } else if (req.user.is_attached) {
//     //user is already attached
//   } else {
//     return conn.query(
//       `UPDATE persons SET is_requested = 1 WHERE user_id = ${req.user.user_id}`
//     );
//   }
//   next();
// }

//------------------ROUTES--------------------
router.get("/", isAdmin, (req, res, next) => {
  console.log("donnnnnnne");
  res.render("d", {
    NAME: req.user.f_name,
  });
});

router.get("/admin", (req, res, next) => {
  console.log("In Admin");
  conn.query(`SELECT * FROM persons`, (err, rows) => {
    if (err) throw err;
    if (!rows.length) {
      console.log("no user---------");
    } else {
      console.log("the actual-----------", rows);
      res.render("admin", {
        NAMEofADMIN: req.user.f_name,
        data: rows,
      });
    }
  });
});

router.get("/admin/approve/(:id)", (req, res, next) => {
  console.log("updating////////");
  conn.query(
    `UPDATE persons SET is_requested = 0, is_approved = 1 WHERE user_id = ${req.params.id}`,
    (err, rows) => {
      if (err) {
        console.log("There was An Error", err);
      } else {
        console.log("updated!!!!!!!!!!!!");
        res.redirect("/d/admin");
      }
    }
  );
});

module.exports = router;
