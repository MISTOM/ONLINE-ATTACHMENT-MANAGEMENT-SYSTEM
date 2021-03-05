const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");
const options = require("./helpers/options");
const conn = require("../lib/db.js");

//________TODAY____________-//
let sdate = new Date();
const today = formatDate(sdate);

// ________________TO HUMAN READABLE FORMAT_________________//
function formatDate(date) {
  if (date === null) return '';
  let d = new Date(date),
    month = (d.getMonth() + 1),
    day = d.getDate(),
    year = d.getFullYear(),
    temp = '' + year;
  temp += ((month < 10) ? '-0' : '-') + month;
  temp += ((day < 10) ? '-0' : '-') + day;

  return temp;
}
// ________________FORMATTING THE LINK SENT TO THE PROFILE PAGE_______________________________//
function splitLink(filepath) {
  // console.log('before edit______________' + filepath);
  if (filepath == null) return "#";
  let popped = filepath.split("\\").pop();
  let x = '/uploads/' + popped;
  // console.log('edited link here___________' + x);
  return x;
};
//___________________________________________________________________//

exports.dView = async (req, res, next) => {
  if (req.user == undefined) {
    res.redirect('/')
  } else if (req.user.role_id === 1) {
    res.redirect('/dashboard/admin')
  } else if (req.user.role_id === 2) {
    res.redirect('/dashboard/supervisor');
  } else {
    console.log("rendering std dashboard...");
    let link = await genPDF(req, res, next);
    res.render("dashboard", {
      cred: req.user,
      link: link
    });
  };
}
exports.dForm = (req, res, next) => {
  if (req.user == undefined) {
    res.redirect('/')
  } else if (req.user.role_id === 1) {
    res.redirect('/dashboard/admin')
  } else if (req.user.role_id === 2) {
    res.redirect('/dashboard/supervisor');
  } else {
    console.log("rendering dform...");
    res.render("dForm", {
      user: req.user
    });
  };
}

exports.dAdmin = (req, res, next) => {
  console.log("In Admin=================");
  conn.query(
    `SELECT * FROM users us INNER JOIN user_profiles up ON us.user_id = up.user_id LEFT JOIN institution_info insf ON insf.student_id = us.user_id INNER JOIN academic_year ay ON ay.academic_year_id = us.academic_year_id INNER JOIN programme prg ON up.programme_id = prg.programme_id`,
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
    }
  );
}

exports.profilePageView = (req, res, next) => {
  console.log("rendering profile page.............");
  let id = req.params.id;

  conn.query(`SELECT * FROM users us INNER JOIN user_profiles up ON us.user_id = ${id} AND up.user_id = ${id} LEFT JOIN institution_info insf ON insf.student_id =${id} LEFT JOIN institution_supervisor insv ON insv.institution_id=insf.institution_id INNER JOIN academic_year ay ON ay.academic_year_id = us.academic_year_id INNER JOIN programme prg ON up.programme_id = prg.programme_id`,
    (err, rows) => {
      if (err) throw err;
      // console.log(rows);
      // console.log(rows, '==============rows[0]=',rows[0]);
      // ____________________-DATE TRAUNCATION-_____________________//
      let date1 = rows[0].from_date;
      let date2 = rows[0].to_date;
      // console.log(date1, date2);
      // console.log(rows[0]);

      const xdate = formatDate(date1);
      const ydate = formatDate(date2);
      //_________________SPLIT LINK_______________//

      const link = splitLink(rows[0].letter_file);

      res.render("profilePage", {
        ROWDATA: rows[0],
        xdate: xdate,
        ydate: ydate,
        link: link
      });
    }
  );
}



exports.Elogbook = (req, res, next) => {
  if (req.user == undefined) { res.redirect('/') } else {

    if (req.user.role_id === 1) res.redirect('/dashboard/admin');

    if (req.user.role_id === 2) {
      res.redirect('/dashboard/supervisor')
    } else {
      console.log("rendering form e-logbook...");
      conn.query(`SELECT * FROM activities_table WHERE user_id = ${req.user.user_id} AND log_date = "${today}"`,
        (err, rows1) => {
          if (err) throw err;
          conn.query(`SELECT * FROM activities_table WHERE user_id = ${req.user.user_id}`, (err, rows2) => {
            if (err) throw err;

            //____FORMATING THE FORMATTED DATE____//
            for (let i in rows2) {
              let fdate = formatDate(rows2[i].log_date);
              rows2[i].fdate = fdate;
            }
            // console.log(rows2)

            res.render('e-logbook', {
              user: req.user,
              rows: rows1,
              allrows: rows2
            });
          })
        }
      );
    }
  }
}

//_____________POST REQUEST FROM LOGBOOK______________//
exports.logbook = (req, res, next) => {
  const dayslog = req.body.logtext;
  const id = req.user.user_id;

  let q = `INSERT INTO activities_table (user_id, student_logs, log_date) VALUES (?, ?, ?)`;
  let v = [`${id}`, `${dayslog}`, `${today}`]

  conn.query(q, v, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/dashboard/e-logbook');
  });
}



//==============POST REQUEST FROM DFORMnpm===========================//
exports.attachForm = (req, res, next) => {
  console.log(req.file, req.body);
  //==============================QUERY 1=====================================================================
  let q1 = `INSERT INTO institution_info (student_id, institution_name, location, from_date, to_date, work_position, website, email_address, additional_info, letter_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  let v1 = [`${req.user.user_id}`, `${req.body.institution}`, `${req.body.location}`, `${req.body.startDate}`, `${req.body.endDate}`, `${req.body.position}`, `${req.body.website}`, `${req.body.email}`, `${req.body.moreInfo}`, `${req.file.path}`];

  //==============================QUERY 2=====================================================================
  let q2 = `INSERT INTO institution_supervisor (supv_first_name, supv_last_name, supv_email, supv_contact, institution_id) VALUES (?, ?, ?, ?, (SELECT MAX(institution_id) from institution_info))`;

  let v2 = [`${req.body.supFirstName}`, `${req.body.supLastName}`, `${req.body.supEmail}`, `${req.body.supContact}`];


  //______________RUNNING QUERY 1________________//
  conn.query(q1, v1, (err, result) => {
    if (err) {
      res.render('error', { message: 'SOMETHING IS WENT WRONG', error: err })
      console.log('===========Failed, there was an error on first query==============');
      throw err;
    } else {
      console.log('details have inserted into institution info table............. next isert should start!!');

      //______________RUNNING QUERY 2________________//
      conn.query(q2, v2, (err, result) => {
        if (err) {
          console.log('===========Failed, there was an error on second query========deliting previous query==');
          //_____________DELETE FROM PREVIOUS QUERY IF ANYTHING GOES WRONG__________//
          conn.query(`DELETE FROM institution_info WHERE institution_id =(SELECT MAX(institution_id) from institution_info)`)
          throw err;
        } else {
          console.log('success: all queries run!!!!!!!!!!!!');
          res.redirect('/dashboard/dForm');
        };
      })
    };
  })
}

//=========================================APPROVE/REJECT CONTROLER=============//
exports.approveCtrl = (req, res, next) => {
  let Aid = req.params.id;
  conn.query(`UPDATE institution_info SET approved = 1 WHERE student_id = ${Aid}`,
    (err, result) => {
      if (err) throw err;
      // console.log(result.message);
      conn.query(`SELECT * FROM institution_supervisor isup INNER JOIN institution_info insf ON insf.institution_id = isup.institution_id AND insf.student_id = ${Aid}`,
        (err, rows) => {
          if (err) throw err;
          //__________________________STUDENTS' SUPERVISORS DETAILS________________/
          let sid = rows[0].institution_supervisor_id;
          let sfst = rows[0].supv_first_name;
          let slst = rows[0].supv_last_name;
          let seml = rows[0].supv_email;
          let scont = rows[0].supv_contact;
          let role = 2;
          let pass = sfst + "-" + slst + "123".toLowerCase();
          let truepass = pass.replace(/\s/g, "");
          //________________________________________________________________________/
          let q = `INSERT INTO users (first_name, last_name, role_id, registration_number, username, password) VALUES (?, ?, ?, ?, ?, ?)`;
          let v = [`${sfst}`, `${slst}`, `${role}`, `${sid}`, `${sfst}`, `${truepass}`];

          conn.query(q, v, (err, results) => {
            if (err) throw err;
            console.log('inserted into users!!!!!!!!!!');
            let q2 = `INSERT INTO user_profiles (user_email, phone_number, user_id) VALUES (?, ?, (SELECT MAX(user_id) FROM users))`;
            let v2 = [`${seml}`, `${scont}`];
            conn.query(q2, v2, (err, results) => {
              if (err) throw err;
              console.log('inserted into user profiles________all queriws success');

              res.redirect(`/dashboard/admin/profileView/${Aid}`);
            });
          });
        }
      );
    }
  );
}

exports.rejectCtrl = (req, res, next) => {
  let Aid = req.params.id;
  conn.query(`DELETE institution_info, institution_supervisor FROM institution_info INNER JOIN institution_supervisor ON institution_info.institution_id = institution_supervisor.institution_id WHERE institution_info.student_id = ${Aid}`, (err, result) => {
    if (err) throw err;
    console.log('The delete from two tables_____________' + result);
  });
}

//=================================================INSTITUTION_SUPERVISOR===========================

exports.supervisor = (req, res, next) => {
  const supNo = req.user.registration_number;
  let q = `SELECT * FROM activities_table WHERE user_id IN (SELECT student_id FROM institution_info insf, institution_supervisor insv WHERE insf.institution_id = insv.institution_id AND insv.institution_supervisor_id = ${supNo})`;
  conn.query(q, (err, rows) => {
    if (err) throw err
    //_____FORMATING THE LOG DATE___
    for (let i in rows) {
      let fdate = formatDate(rows[i].log_date);
      rows[i].fdate = fdate;
    }
    res.render('supervisor', {
      user: req.user,
      rows: rows
    })
  });
}

exports.supComment = (req, res, next) => {
  const supervisorLog = req.body.supervisorLogs;
  const logdate = req.body.logdate;
  const userid = req.body.userid
  console.log(req.body);
  let q = 'UPDATE `activities_table` SET `supervisors_logs`= ' + '"' + supervisorLog + '"' + ' WHERE `log_date`=' + '"' + logdate + '"' + ' AND `user_id`=' + userid + '';

  conn.query(q, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/dashboard/supervisor');
  })
}

//=========================================================GENERATING PDF()===========================
const genPDF = async (req, res, next) => {
  const html = fs.readFileSync(path.join(__dirname, '../views/Templates/pdf.html'), 'utf-8');
  const fileName = req.user.first_name + '_' + req.user.registration_number + '.pdf';
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
  pdf.create(document, options)
    .then(console.log('pdf-success'))
    .catch(e => console.log(e));

  let filePath = 'docs/' + fileName;
  // console.log(filePath);

  return filePath;
}
//=============================================================================================================