const express = require("express");
const router = express.Router();
const conn = require("../lib/db");

router.get("/testApi", (req, res) => {
    let q = `SELECT * FROM users`;
    conn.query(q, (err, rows) => {
        if (err) throw err;
        if (!rows.length) {
            res.send(JSON.stringify('no user found'));

        } else {
            // res.send(JSON.stringify(rows));
            res.json(rows);
        }
    })
});

router.get('/testApi/byYear/:id', (req, res) => {
    let intake_year = req.params.id;
    let q = `SELECT * FROM persons WHERE intake_year = ${intake_year}`;
    conn.query(q, (err, rows) => {
        if (err) throw err;
        if (!rows.length) {
            res.send(JSON.stringify(`the user with the intake_year ${intake_year} is not found`));
        } else {
            res.json(rows);
        };
    })
});






module.exports = router;