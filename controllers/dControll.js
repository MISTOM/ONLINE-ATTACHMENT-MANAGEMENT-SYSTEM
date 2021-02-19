const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("./helpers/options");
const conn = require("../lib/db.js");


const dView = async (req, res, next) => {
    if(req.user == "undefined" || req.user == undefined){
      res.redirect('/');
    } else{
        if (req.user.role_id === 1) {
            res.redirect('/dashboard/admin');
        } else if (req.user.role_id === 2){
             res.send(`this will go to the institution supervisor ${req.user.first_name} ${req.user.last_name}.`)
        } else {
            console.log("rendering std dashboard...");
            let link = await genPDF(req,res,next);
            res.render("dashboard", {
            cred: req.user,
            link:link
            });
        };
    };
}

const dForm =(req, res, next) => {
  if(req.user == "undefined" || req.user == undefined){
    res.redirect('/');
  } else if(req.user.role_id === 1) {
          res.redirect('/dashboard/admin');
      } else if(req.user.role_id === 2) {
          res.send(`This will go to the supervisor ${req.user.first_name} page`);
      } else {
          console.log("rendering form dashboard...");
          res.render('dform', {
            user:req.user
          })
      };
};


const dAdmin = (req, res, next) => {
    console.log("In Admin=================");
    conn.query(`SELECT * FROM users us INNER JOIN user_profiles up ON us.user_id = up.user_id LEFT JOIN institution_info insf ON insf.student_id = us.user_id INNER JOIN academic_year ay ON ay.academic_year_id = us.academic_year_id INNER JOIN programme prg ON up.programme_id = prg.programme_id`,
     (err, rows) => {
      if (err) throw err;
      if (!rows.length) {
        console.log("no user---------");
      } else {
        // console.log("the actual-----------", rows);
        res.render("admin", {
          cred: req.user,
          data: rows
        });
      }
    });
}

const profilePageView = (req, res, next) => {
  console.log("rendering profile page.............");
  let id = req.params.id;

  conn.query(`SELECT * FROM users us INNER JOIN user_profiles up ON us.user_id = ${id} AND up.user_id = ${id} LEFT JOIN institution_info insf ON insf.student_id =${id} LEFT JOIN institution_supervisor insv ON insv.institution_id=insf.institution_id INNER JOIN academic_year ay ON ay.academic_year_id = us.academic_year_id INNER JOIN programme prg ON up.programme_id = prg.programme_id`,
   (err, rows) => {
    if (err) throw err;
    console.log(rows);
      // console.log(rows, '==============rows[0]=',rows[0]);
    res.render("profilePage", {
      ROWDATA:rows[0],
      link:'this is link'
    });
  });
}
//==============POST REQUEST FROM DFORM CONTROLER===========================//
const attachForm = (req, res, next) =>{
  console.log(req.file, req.body);
  //==============================QUERY 1=====================================================================
  let q1 =`INSERT INTO institution_info (student_id, institution_name, location, from_date, to_date, work_position, website, email_address, additional_info, letter_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  let v1 =[`${req.user.user_id}`,`${req.body.institution}`,`${req.body.location}`,`${req.body.startDate}`,`${req.body.endDate}`,`${req.body.position}`,`${req.body.website}`,`${req.body.email}`,`${req.body.moreInfo}`,`${req.file.path}`];

//==============================QUERY 2=====================================================================
  let q2 = `INSERT INTO institution_supervisor (supv_first_name, supv_last_name, supv_email, supv_contact, institution_id) VALUES (?, ?, ?, ?, (SELECT MAX(institution_id) from institution_info))`;

  let v2 = [`${req.body.supFirstName}`,`${req.body.supLastName}`,`${req.body.supEmail}`,`${req.body.supContact}`];


//______________RUNNING QUERY 1________________//
  conn.query(q1, v1, (err, result) => {
    if (err){
      res.render('error', {message:'SOMETHING IS WENT WRONG', error:err})
      console.log('===========Failed, there was an error on first query==============');
      throw err;
    } else { 
      console.log('details have inserted into institution info table............. next isert should start!!');

//______________RUNNING QUERY 2________________//
      conn.query(q2, v2, (err, result) =>{
        if (err){
          console.log('===========Failed, there was an error on second query========deliting previous query==');
//_____________DELETE FROM PREVIOUS QUERY IF ANYTHING GOES WRONG__________//
          conn.query(`DELETE FROM institution_info WHERE institution_id =(SELECT MAX(institution_id) from institution_info)`)
          throw err;
        } else {
          console.log('success: all queries run!!!!!!!!!!!!');
          res.redirect('/dashboard/dform');
        };
      }) 
    };
  })
}



//=========================================================GENERATING PDF()===========================

const genPDF = async (req, res, next) =>{
    const html = fs.readFileSync(path.join(__dirname, '../views/Templates/pdf.html'), 'utf-8');
    const fileName = req.user.first_name+ '_'+req.user.registration_number+'.pdf'; 
    // conn.query(`SELECT programme_name FROM programme WHERE programme_id = ${req.user.programme_id}`,
    //  (err, rows) => {
    //   if (err) throw err;
    //   console.log(rows);
    //   return rows[0];
    // })
    
    console.log(req.user);
    const document = {
      html: html,
      data: {
        USERID: req.user.registration_number,
        FIRSTNAME: req.user.first_name,
        LASTNAME: req.user.last_name,
        OTHERNAME: req.user.other_name,
        PROGRAMME: req.user.programme_name,
        DEPARTMENT: req.user.department_name,
        SCHOOL: req.user.school_name
      },

      path: './public/docs/' + fileName
    }
    pdf.create(document,options)
    .then(console.log('pdf-success'))
    .catch( e => console.log(e) );

    let filePath = 'docs/' + fileName;
    // console.log(filePath);

    
    return filePath;
}
//=============================================================================================================

module.exports = {
    dView,
    dForm,
    dAdmin,
    profilePageView,
    attachForm
};