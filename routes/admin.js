const express = require('express');
const router = express.Router();
const conn = require('../lib/db');
// const flash = require('express-flash');

/* GET home page. */
router.get('/admin', function(req, res, next) {
  conn.query('SELECT * FROM persons', (err, rows, fields)=>{
    if(err){
      console.log(err);
      res.render('admin', {PAGETITLE:'All Students', data:''});
    }else{
      res.render('admin', {PAGETITLE:'All Students', data:rows})
    }


    });
})


module.exports= router;