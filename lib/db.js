const logger = require("../logger/config.js")
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS,
  database: "oams",
  multipleStatements: true
});
connection.connect(error => {
  if (error) {
    console.log("SOmething Went Wrong...", error);
    logger.error("Database error on connection", { errorStack: error })

  } else {
    console.log("Connected!:)");
  }
});
module.exports = connection;
