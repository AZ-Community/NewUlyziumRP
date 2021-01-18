const mysql = require("mysql");

module.exports = client => {
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
        if(err) throw err;
        console.log("[ADVERT - DB] Connected to database !");
    });

    /** 
     * Database Initialisation 
     * -> Query to create all tables needed to run bot
    */
    con.query(`
        CREATE TABLE IF NOT EXISTS player( id VARCHAR(25) PRIMARY KEY, level INT DEFAULT 1, xp INT DEFAULT 0, stats TEXT, equipment TEXT, 
				bronze INT DEFAULT 50, argent INT DEFAULT 0, gold INT DEFAULT 0, ziums INT DEFAULT 0);
				CREATE TABLE IF NOT EXISTS inventory( idplayer VARCHAR(25), itemid VARCHAR(25), quantity INT DEFAULT 1);
				CREATE TABLE IF NOT EXISTS marketChannel (idChannel INT UNIQUE, itemsMarket TEXT);
        CREATE TABLE IF NOT EXISTS channelXPBan( idServer VARCHAR(31), idChannel VARCHAR(30), PRIMARY KEY(idServer, idChannel) );
        CREATE TABLE IF NOT EXISTS progress(idplayer VARCHAR(25), pgrplayers INT DEFAULT 0,dialog INT DEFAULT 0, pnj VARCHAR(10));
        CREATE TABLE IF NOT EXISTS itemLists(type VARCHAR(25) UNIQUE, items TEXT DEFAULT NULL);
        `, err => { if(err) throw err; }
    );

    // Keep connection function because of DB force timeout
    setInterval(function () {
        con.query('SELECT 1');
    }, 57000);

    client.con = con;

    // Functions which allow you to interact with database tables
}
