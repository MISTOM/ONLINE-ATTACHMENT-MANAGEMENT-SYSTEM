const express = require("express");
const router = express.Router();
const conn = require("../lib/db.js");
const path = require("path");
const fs = require("fs")
// const flash = require('express-flash');

const { dView, dAdmin, dForm } = require("../controllers/dControll")
const { control } = require("../controllers/routeControll");
const { check, validationResult, matchedData } = require("express-validator");

//==============================MULTER CONFIGURATION=========================

const multer  = require('multer');
const storage = multer.diskStorage({
  destination:(req, file, cb) => {
    let dir = 'public/uploads/';
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir)
  },

  filename:(req, file, cb) => {
    cb(null, req.user.f_name+ '_' +req.user.user_id+ '_' +Date.now()+ '-' + path.extname(file.originalname).toLowerCase())
  }
});
const fileFilter = (req, file, cb) => {

    const filetypes = /pdf|docx|docs/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log(mimetype, extname, 'mimetype and extname', file.mimeype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
        return cb("Error: File upload only supports the following filetypes - " + filetypes);
    };
  };
const upload = multer({storage: storage, fileFilter:fileFilter});
//==============================================================================



/**------------------ROUTES--------------------*/
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

router.post('/attachfrm',upload.single('attachFile'), (req, res, next) => {
  let fileInfo = req.file;
  let formInputs = req.body;
  console.log(formInputs,fileInfo);
  res.send(fileInfo);
  }
);





















router.get("/logout", (req, res, next)=>{
  req.session.destroy(()=>{
    req.logOut();
    res.redirect('/');
  });
})
module.exports = router;
