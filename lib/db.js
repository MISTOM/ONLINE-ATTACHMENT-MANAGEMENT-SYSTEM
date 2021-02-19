const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "get_letter",
});
connection.connect( error => {
  if (error) {
    console.log("SOmething Went Wrong...", error);
  } else {
    console.log("Connected!:)");
  }
});
module.exports = connection;
