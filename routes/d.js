const express = require('express');
const router = express.Router();
const conn = require('../lib/db');
// const flash = require('express-flash');

function isAdmin(req, res, next){
    if(req.user.is_admin){
        console.log('rendering admin view........')
        res.redirect('/d/admin');
    }else{
        return next();
    };
  }
  //------------------ROUTES--------------------
router.get('/',isAdmin, (req, res, next) => {
    console.log("donnnnnnne");
    res.render('d', {
        NAME: req.user.f_name
    });
  });

router.get('/admin', (req,res, next)=>{
    console.log("In Admin");    
    res.render('admin', {
        NAMEofADMIN: req.user.f_name
    });
  });


//===========controller for is admin====

module.exports = router;
