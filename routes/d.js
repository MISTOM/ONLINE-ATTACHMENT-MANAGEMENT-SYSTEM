const express = require("express");
const router = express.Router();
const conn = require("../lib/db.js");
// const flash = require('express-flash');

function control(req, res, next) {
  if(req.user == "undefined" || req.user == undefined){
    res.redirect('/');
  }else{
    if (req.user.is_admin) {
      return next();
    } else {
      res.redirect('/d');
    }
  }
}

//------------------ROUTES--------------------
router.get("/", (req, res, next) => {
  if(req.user == "undefined" || req.user == undefined){
    res.redirect('/');
  }else{
    if (req.user.is_admin) {
      res.redirect('/d/admin');
    } else {
      console.log("donnnnnnne");
      res.render("d", {
        NAME: req.user.f_name,
      });
    }
  }
});

router.get("/admin", control, (req, res, next) => {
  console.log("In Admin=================", req.session);
  conn.query(`SELECT * FROM persons`, (err, rows) => {
    if (err) throw err;
    if (!rows.length) {
      console.log("no user---------");
    } else {
      // console.log("the actual-----------", rows);
      res.render("admin", {
        NAMEofADMIN: req.user.f_name,
        data: rows,
      });
    }
  });
});
=== 
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

router.get("/logout", (req, res, next)=>{
  req.session.destroy(()=>{
    req.logOut();
    res.redirect('/');
  });
})
module.exports = router;
