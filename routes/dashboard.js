const express = require("express");
const router = express.Router();
const conn = require("../lib/db.js");
const path = require("path");
const fs = require("fs");
// const flash = require('express-flash');

const funs = require("../controllers/dControll");

const { control } = require("../controllers/routeControll");
const { check, validationResult, matchedData } = require("express-validator");

//==============================MULTER CONFIGURATION=========================

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = 'public/uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir)
  },

  filename: (req, file, cb) => {
    cb(null, req.user.first_name + '_' + req.user.registration_number + '_' + Date.now() + path.extname(file.originalname).toLowerCase())
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
    console.log('file type not a mach!!!!!!!!!!')
    return cb("Error: File upload only supports the following filetypes - " + filetypes);
  };
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
//==============================================================================


/------------------ROUTES--------------------/
router.get("/", funs.dView);
router.get("/dForm", funs.dForm);
router.get("/e-logbook", funs.Elogbook);
router.get("/admin", control, funs.dAdmin);
router.get("/admin/profileView/(:id)", funs.profilePageView)

router.get("/admin/approve/(:id)", funs.approveCtrl);
router.get("/admin/reject/(:id)", funs.rejectCtrl);

router.post("/attachfrm", upload.single("attachFile"), funs.attachForm);
router.post("/e-logbook", funs.logbook);

router.get("/supervisor", funs.supervisor);
router.post("/supervisorlogs", funs.supComment)

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    req.logOut();
    res.redirect('/');
  });
})

module.exports = router;
