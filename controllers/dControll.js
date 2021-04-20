const fs = require("fs")
  , nodemailer = require("nodemailer")
  , conn = require("../lib/db.js")
  , { genPDF } = require("./helpers/pdfConfig");
const { clearTimeout } = require("timers");
const logger = require("../logger/config.js");

/________TODAY____________-/
let sdate = new Date();
const today = formatDate(sdate);

/________________TO HUMAN READABLE FORMAT_________________/
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
/_________________________________________________________/

//=================================2-FACTOR AUTHENTICATION===========================================

function send2FACode(user) {
  const code = Math.floor(100000 + Math.random() * 900000);
  console.log(code);

  conn.query(`UPDATE users SET _2faCode = ${code} WHERE user_id = ${user.user_id}`,
    (err, result) => {
      if (err) {
        logger.error(`Error on inserting 2fa code`, { user: user.user_id, dbErr: err })
        throw err;
      }
      console.log("code inserted into db", result);
    })

  let emailbody = `<h1>Dear ${user.first_name}</h1><br>
  <h3>The 2 Factor Authentication for your OAMS Account has been successfully set.</h3><hr>
  <h3>Your one time code is <pre>${code}</pre> Valid for one minute</h3>
  <p>If you did not enable 2FA, please ignore this email and <a href="#">Secure your account</a></p>
  <small>Thank You; Regards OAMS Management.</small>`;

  let emailText = `<h1>Dear ${user.first_name}</h1><br>
  <h3>The 2 Factor Authentication for your OAMS Account has been successfully set.</h3><hr>
  <h3>Your one time code is <pre>${code}</pre> Valid for one minute</h3>
  <p>If you did not enable 2FA, please ignore this email and <a href="#">Secure your account</a></p>
  <small>Thank You; Regards OAMS Management.</small>`;
  // sendEmail(user.user_email, emailbody, 'Your 2FA Code', emailText);

  clearCodeTimeout(user);
}

//___code clear from db timeout id___
let dbTimeout;
function clearCodeTimeout(user) {

  dbTimeout = setTimeout(clearFromDb, 120000, user);

  function clearFromDb(user) {
    conn.query(`UPDATE users SET _2faCode = -1 WHERE user_id = ${user.user_id}`,
      (err, result) => {
        if (err) {
          console.log("ERR on clearing code from db", result);
          logger.error(`Error on clearing 2fa code`, { user: user.user_id, dbErr: err })
          throw err
        } else { console.log("2fa code cleared from db after 2 minutes"); logger.info("2fa code cleared", { user: user.user_id }) };

      })
  }
}

exports.validate2faCode = (req, res, next) => {
  const code = req.body.code;
  if (code > 0) {
    console.log(code);
    conn.query(`SELECT _2faCode FROM users WHERE user_id = ${req.user.user_id}`,
      (err, rows) => {
        if (err) throw err;
        if (rows[0]._2faCode == code) {
          clearTimeout(dbTimeout)
          conn.query(`UPDATE users SET _2faCode = 0 WHERE user_id = ${req.user.user_id}`,
            (err, result) => {
              if (err) throw err;
              res.json("2FAValid");
            })
        } else {
          res.json("Please check your email for the code.");
        }
      })
  } else {
    return res.json("Please check your email for the code.")
  }

}

//______-IF USER HAS ACTIVATED 2FA AND HAS LOGGED OUT WILL BE PROMPTED-______
exports._2faValidation = (req, res, next) => {
  if (req.user == undefined) return res.redirect('/');
  if (req.user.is2faEnabled && req.user._2faCode == -1 || req.user._2faCode !== 0) {
    send2FACode(req.user); res.render("2FAuthenticate", { user: req.user.user_id });
    logger.info("2fa enabled user login", { user: req.user.user_id })
  }
  else {
    logger.info("2fa disabled user login", { user: req.user.user_id })
    next();
  }
}

exports.activate2FA = (req, res, next) => {
  const id = req.params.id;
  conn.query(`UPDATE users SET is2faEnabled = 1 WHERE user_id = ${id}`,
    (err, result) => {
      if (err) {
        logger.error("Error activating 2fa", { user: req.user.user_id, dbError: err })
        res.json("failed"); throw err;
      }
      logger.info("2fa activated", { user: req.user.user_id })
      res.json("activated");
      // console.log(result);
    });
}

exports.deactivate2FA = (req, res, next) => {
  const id = req.params.id;
  conn.query(`UPDATE users SET is2faEnabled = 0 WHERE user_id = ${id}`,
    (err, result) => {
      if (err) {
        logger.error("Error deactivating 2fa", { user: req.user.user_id, dbError: err })
        res.json("failed"); throw err;
      }
      logger.info("2fa deactivated", { user: req.user.user_id })
      res.json("disabled");
    });
}
//============================================================================================

exports.dView = async (req, res, next) => {
  console.log(req.ip);
  if (req.user.role_id === 1) {
    res.redirect('/dashboard/admin')
  } else if (req.user.role_id === 2) {
    res.redirect('/dashboard/supervisor');
  } else {
    console.log("rendering std dashboard...");
    let link = await genPDF(req, res, next);
    logger.info("route for student dashboard hit")
    res.render("dashboard", {
      user: req.user,
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
      user: req.user,
      minDate: today
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
          user: req.user,
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

      const link = `/uploads/${rows[0].letter_file}`;

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
          conn.query(`SELECT * FROM activities_table WHERE user_id = ${req.user.user_id} ORDER BY log_id DESC`, (err, rows2) => {
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
              allrows: rows2,
              msg: req.flash("msg")
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
    if (err) {
      logger.error("Error student logging", { user: req.user.user_id, studentLog: dayslog, dbError: err });
      throw err;
    }
    logger.info("student logged", { user: req.user.user_id, studentLog: dayslog })
    console.log(result);
    // sendEmail("kigardetom2001@gmail.com", `<h1>hello there</h1> <h3>${dayslog}</h3>`, "oams", "this is the body")
    //   .catch(e => { console.log(e) });
    req.flash("msg", "Log Successfuly submitted.")
    res.redirect('/dashboard/e-logbook');
  });
}



//==============POST REQUEST FROM DFORM===========================//
exports.attachForm = (req, res, next) => {
  console.log(req.file, req.body);
  //==============================QUERY 1=====================================================================
  let q1 = `INSERT INTO institution_info (student_id, institution_name, location, from_date, to_date, work_position, website, email_address, additional_info, letter_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  let v1 = [`${req.user.user_id}`, `${req.body.institution}`, `${req.body.location}`, `${req.body.startDate}`, `${req.body.endDate}`, `${req.body.position}`, `${req.body.website}`, `${req.body.email}`, `${req.body.moreInfo}`, `${req.file.filename}`];

  //==============================QUERY 2=====================================================================
  let q2 = `INSERT INTO institution_supervisor (supv_first_name, supv_last_name, supv_email, supv_contact, institution_id) VALUES (?, ?, ?, ?, (SELECT MAX(institution_id) from institution_info))`;

  let v2 = [`${req.body.supFirstName}`, `${req.body.supLastName}`, `${req.body.supEmail}`, `${req.body.supContact}`];


  //______________RUNNING QUERY 1________________//
  conn.query(q1, v1, (err, result) => {
    if (err) {
      logger.error("Error inserting institution", { user: req.user.user_id, dbError: err })
      console.log('===========Failed, there was an error on first query==============');
      throw err;
    } else {
      console.log('details have inserted into institution info table............. next isert should start!!');

      //______________RUNNING QUERY 2________________//
      conn.query(q2, v2, (err, result) => {
        if (err) {
          logger.error("Error inserting supervisor", { user: req.user.user_id, dbError: err })
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
      if (err) {
        logger.error("Error updating student approval", { user: req.user.user_id, dbError: err })
        throw err;
      }
      // console.log(result.message);
      conn.query(`SELECT * FROM institution_supervisor isup INNER JOIN institution_info insf ON insf.institution_id = isup.institution_id AND insf.student_id = ${Aid}`,
        (err, rows) => {
          if (err) throw err;

          //__________________________STUDENTS' SUPERVISORS DETAILS________________/
          let sid = `sup-no-${rows[0].institution_supervisor_id}`;
          let sfst = rows[0].supv_first_name;
          let slst = rows[0].supv_last_name;
          let seml = rows[0].supv_email;
          let scont = rows[0].supv_contact;
          let role = 2;

          let institution = rows[0].institution_name
          //________________________________________________________________________/

          let q = `INSERT INTO users (first_name, last_name, role_id, registration_number, username) VALUES (?, ?, ?, ?, ?)`;
          let v = [`${sfst}`, `${slst}`, `${role}`, `${sid}`, `${sfst}`];

          conn.query(q, v, (err, results) => {
            if (err) {
              logger.error("Error creating supervisor to be a user", { user: req.user.user_id, dbError: err })
              throw err;
            }
            console.log('inserted into users!!!!!!!!!!');

            let q2 = `INSERT INTO user_profiles (user_email, phone_number, user_id) VALUES (?, ?, (SELECT MAX(user_id) FROM users))`;
            let v2 = [`${seml}`, `${scont}`];

            conn.query(q2, v2, (err, results) => {
              if (err) {
                logger.error("Error creating supervisor user-profiles", { user: req.user.user_id, dbError: err })
                throw err;
              }
              logger.info("Supervisor created || student approved", { supervisor: v, approvedStudent: Aid })
              console.log('inserted into user profiles________all queriws success');

              conn.query(`SELECT * FROM users WHERE user_id = ${Aid}`,
                (err, rows) => {
                  if (err) throw err;
                  /----------------------------------SEND EMAIL TO SUPERVISOR----------------------------/
                  let output = `<h1>Dear ${sfst} - ${institution}</h1><br>
                              <h3>The username for your OAMS Account is ${seml}.</h3><hr>
                              <h3>The password is ${sid}.</h3>
                              <p>Follow this link to login as ${rows[0].first_name} ${rows[0].last_name} ${rows[0].other_name}'s Supervisor =>: <a href="http://96.126.122.21">Online Attachment Management System</a></p>
                              <p>If you are not the supervisor at ${institution}, please ignore the email</p>
                              <small>Thank You; Regards OAMS Management.</small>`;
                  let mailtext = `<h1>Dear ${sfst} - ${institution}</h1><br>
                  <h3>The username for your OAMS Account is ${seml}.</h3><hr>
                  <h3>The password is ${sid}.</h3>
                  <p>Follow this link to login as ${rows[0].first_name} ${rows[0].last_name} ${rows[0].other_name}'s Supervisor =>: <a href="http://96.126.122.21">Online Attachment Management System</a></p>
                  <p>If you are not the supervisor at ${institution}, please ignore the email</p>
                  <small>Thank You; Regards OAMS Management.</small>`;
                  let mailSubject = "Credentials of the Online Attachment System"

                  sendEmail(`${seml}`, output, mailSubject, mailtext)
                    .catch(e => logger.error("Error sending email credentals ot supervisor", { supervisor: v, emailError: e }));

                  res.redirect(`/dashboard/admin/profileView/${Aid}`);

                })

            });
          });
        }
      );
    }
  );
}

exports.rejectCtrl = (req, res, next) => {
  let { id: stdId } = req.params;
  let rejectMessage = req.body.rejectMessage;
  console.log(req.body)

  conn.query(`UPDATE institution_info SET rejected = 1 WHERE student_id = ${stdId}; UPDATE institution_info SET reject_message = "${rejectMessage}" WHERE student_id = ${stdId}`,
    (err, result) => {
      if (err) {
        logger.error("error rejecting std submission", { student: stdId, dbError: err });
        throw err;
      } else {
        logger.info(`student ${stdId} submission rejected`, { rejectedBy: req.user.user_id, rejectMessage: rejectMessage });
        res.json("REJECT_SUCCESS")
      }
    })
}

//=================================================INSTITUTION_SUPERVISOR===========================

exports.supervisor = (req, res, next) => {
  if (req.user == undefined) return res.redirect('/');
  let supregNo = req.user.registration_number;
  const supNo = supregNo.split("-").pop();

  let q = `SELECT * FROM activities_table WHERE user_id IN (SELECT student_id FROM institution_info insf, institution_supervisor insv WHERE insf.institution_id = insv.institution_id AND insv.institution_supervisor_id = ${supNo}) ORDER BY log_id DESC`;
  conn.query(q, (err, rows) => {
    if (err) throw err
    //_____FORMATING THE LOG DATE___
    for (let i in rows) {
      let fdate = formatDate(rows[i].log_date);
      rows[i].fdate = fdate;
    }
    res.render('supervisor', {
      user: req.user,
      rows: rows,
      msg: req.flash("message")
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
    logger.info(`supervisor comment on student ${userid}`, { user: req.user.user_id, comment: supervisorLog })
    console.log(result);
    req.flash("message", "Comment added successfully.")
    res.redirect('/dashboard/supervisor');
  })
}


//==================================================NODEMAILER=======================================
"use strict";

async function sendEmail(toAccount, mailhtml, mailSubject, mailText) {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.ACC_USER,
      pass: process.env.ACC_PASSWORD
    }
  });

  // send mail with defined transport object
  let mailOptions = {
    from: `"OnlineAMS" <${process.env.ACC_USER}>`, // sender address
    to: toAccount, // list of receivers
    subject: mailSubject, // Subject line
    text: mailText, // plain text body
    html: mailhtml, // html body
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err)
    }
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  })
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
/=============================================================================================================/