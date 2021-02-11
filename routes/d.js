const express = require("express");
const router = express.Router();
const conn = require("../lib/db.js");
const path = require("path");
// const flash = require('express-flash');

const { dView, dAdmin, dForm } = require("../controllers/dControll")
const { control } = require("../controllers/routeControll");
const { check, validationResult, matchedData } = require("express-validator");

//==============================MULTER CONFIGURATION===================

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.f_name+ '_' +req.user.user_id+ '_' +Date.now()+ '-' + path.extname(file.originalname))
  }
})
const upload = multer({storage: storage})


//------------------ROUTES--------------------
router.get("/", dView);
router.get("/dForm", dForm)
router.get("/admin", control, dAdmin);

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

router.post('/attachfrm', (req, res) => {
    upload.single('attachFile')(req, res, (error)=>{
      if(error){
        res.render("dForm", {
          msg:error
        });
      }else{
        console.log('the request body', req.body);
        console.log('heres the request.file',req.file);
        res.send("uploaded")
      }
    })
  }
);





















router.get("/logout", (req, res, next)=>{
  req.session.destroy(()=>{
    req.logOut();
    res.redirect('/');
  });
})
module.exports = router;
