const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("./helpers/options");
const conn = require("../lib/db.js");


const dView = async (req, res, next) => {
    if(req.user == "undefined" || req.user == undefined){
      res.redirect('/');
    } else{
        if (req.user.is_admin) {
            res.redirect('/dashboard/admin');
        } else {
            console.log("rendering std dashboard...");
            let link = await genPDF(req,res,next);
            res.render("dashboard", {
            NAME: req.user.f_name,
            link:link
            });
        };
    };
}

const dForm =(req, res, next) => {
  if(req.user == "undefined" || req.user == undefined){
    res.redirect('/');
  } else{
      if (req.user.is_admin) {
          res.redirect('/dashboard/admin');
      } else {
          console.log("rendering form dashboard...");
          res.render("dForm", {
          NAME: req.user.f_name,
          });
      };
    };
}
const dAdmin =  async (req, res, next) => {
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
}

//=========================================================GENERATING PDF()===========================

const genPDF = async (req, res, next) =>{
    const html = fs.readFileSync(path.join(__dirname, '../views/Templates/pdf.html'), 'utf-8');
    const fileName = req.user.f_name+ '_'+req.user.user_id+'.pdf';
    
    const document = {
      html: html,
      data: {
        USERID: req.user.user_id,
        FIRSTNAME: req.user.f_name,
        LASTNAME: req.user.l_name,
        PROGRAMME: req.user.programme,
        EMAIL: req.user.email
      },
      path: './public/docs/' + fileName
    }
    pdf.create(document,options)
    .then(console.log('success'))
    .catch( e => console.log(e) );

    let filePath = 'docs/' + fileName;
    console.log(filePath);

    
    return filePath;
}
//=============================================================================================================

module.exports = {
    dView,
    dForm,
    dAdmin
};