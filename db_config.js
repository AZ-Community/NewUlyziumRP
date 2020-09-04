const mysql = require("mysql");

// Connection to DB
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB,
    multipleStatements: true
});

// Advert when connected to DB
con.connect(function(err) {
    if(err) console.log('[ERROR - DB] Error when connecting.', err);
    console.log("[ADVERT - DB] Connected to database !");
});

// Keep connection function because of DB force timeout
setInterval(function () {
    con.query('SELECT 1');
}, 57000);

module.exports = con;