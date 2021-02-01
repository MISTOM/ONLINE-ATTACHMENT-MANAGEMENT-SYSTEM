const express = require('express');
const router = express.Router();
const conn = require('../lib/db');
// const flash = require('express-flash');

const { check, validationResult, matchedData } = require("express-validator");


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('d', {
//      title: 'LOGIN',
//      email: '',
//      password: ''
//  });
// });

// router.post('/authentication', (req, res, next)=>{
//   console.log(req.body.username);
//   const errors = validationResult(req)
//   if(!errors.isEmpty()){
//     return res.render('index',{
//       title: 'LOGIN',
//       data: req.body,
//       errors: errors.mapped()
//     });
//   }
//   const data = req.body;
//   console.log("the data:", data);

//   ////////////////DATAS/////////
//   const username = data.username;
//   const password = data.password;

//   ////////////////QUERY////////
// conn.query('SELECT * FROM persons WHERE username = ? AND password = ?', [username, password], (err, rows, fields)=>{
//   if(err) throw err;
//   console.log('here are the fields and rows',fields);

//   if(rows.length <= 0){
//     res.redirect('/');
//     res.send('Please enter correct email and password!');
//     // req.flash('error!','Please enter correct email and password!')
//   }
//     console.log('logged is success');
//     res.redirect('/d')

// });
// })
module.exports = router;
