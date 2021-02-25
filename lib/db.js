const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "kirwa",
  database: "oams"
});
connection.connect(error => {
  if (error) {
    console.log("SOmething Went Wrong...", error);
  } else {
    console.log("Connected!:)");
  }
});
module.exports = connection;
