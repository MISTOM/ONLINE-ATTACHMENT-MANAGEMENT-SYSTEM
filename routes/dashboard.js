const express = require('express');
const router = express.Router();
const conn = require('../lib/db.js');
const path = require('path');
const fs = require('fs');

const logger = require('../logger/config.js');
const funs = require('../controllers/dControll');

const { control } = require('../controllers/routeControll');

const { getClientIp } = require('@supercharge/request-ip');
const getIp = (req, res, next) => {
  req.ip = getClientIp(req);
  next();
};

//= =============================MULTER CONFIGURATION=========================

const multer = require('multer');
const { error } = require('winston');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, req.user.first_name + '_' + req.user.registration_number + '_' + Date.now() + path.extname(file.originalname).toLowerCase());
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
    console.log('file type not a mach!!!!!!!!!!');
    return cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
//= =============================================================================

/------------------ROUTES--------------------/;
router.get('/', funs._2faValidation, getIp, funs.dView);
router.get('/dForm', funs.dForm);
router.get('/e-logbook', funs.Elogbook);
router.get('/admin', control, funs.dAdmin);
router.get('/admin/profileView/(:id)', funs.profilePageView);
router.get('/landing', (req, res, next) => { res.render('landing'); });

router.get('/admin/approve/:id', funs.approveCtrl);
router.post('/admin/reject/:id', funs.rejectCtrl);

router.post('/attachfrm', upload.single('attachFile'), funs.attachForm);
router.post('/e-logbook', funs.logbook);

router.get('/supervisor', funs.supervisor);
router.post('/supervisorlogs', funs.supComment);

router.get('/activate2FA/(:id)', funs.activate2FA);
router.get('/deactivate2FA/(:id)', funs.deactivate2FA);
router.post('/validate2faCode', funs.validate2faCode);

router.get('/logout', (req, res, next) => {
  if (req.user == undefined) return res.redirect('/');
  const id = req.user.user_id;

  if (req.user.is2faEnabled) {
    conn.query(`UPDATE users SET _2faCode = -1 WHERE user_id =${id}`, (err, result) => {
      if (err) { console.log('error whole logging out', result); throw err; } else {
        logger.info('2fa active user logged out!', { user: req.user.user_id });
        req.session.destroy(() => {
          req.logOut();
          res.redirect('/');
        });
      }
    });
  } else {
    logger.info('2fa disbled user logged out!', { user: req.user.user_id });
    req.session.destroy(() => {
      req.logOut();
      res.redirect('/');
    });
  }
});

module.exports = router;
