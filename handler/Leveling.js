
module.exports = client => {
    /**
     * client.channelIsXPBan -> Check if channel is XP ban.
     * @require checkChannelIsXPBan function.
     * @param {*} idServer Server id.
     * @param {*} idChannel Channel id.
     * @return true if it isn't ban, otherwise false.
     */
    client.channelIsXPBan = (idServer, idChannel) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM channelXPBan WHERE idServer = '${idServer}' AND idChannel = '${idChannel}';`, (err, rows) => {
                if(err) reject(err);
                if(rows.length >= 1) resolve(true);
                resolve(false);
            });
        });
    }

    /**
     * client.banXPChannel -> Allow you to blacklist a channel from XP reward. 
     * @param {*} idServer Server id.
     * @param {*} idChannel Channel id.
     * @return false if channel is already ban, true if it has just been banned
     */
    client.banXPChannel = (idServer, idChannel) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM channelXPBan WHERE idServer = '${idServer}' AND idChannel = '${idChannel}';`, (err, rows) => {
                if(err) reject(err);
                if(rows.length >= 1) resolve(false);

                client.con.query(`INSERT INTO channelXPBan VALUES('${idServer}', '${idChannel}');`, err => {
                    if(err) reject(err);
                    resolve(true);
                });
            })
        });
    }

    /**
     * 
     * @param {*} idServer 
     * @param {*} idChannel 
     */
    client.unbanXPChannel = (idServer, idChannel) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM channelXPBan WHERE idServer = '${idServer}' AND idChannel = '${idChannel}';`, (err, rows) => {
                if(err) reject(err);
                if(rows.length < 1) resolve(false);

                client.con.query(`DELETE FROM channelXPBan WHERE idServer = '${idServer}' AND idChannel = '${idChannel}';`, err => {
                    if(err) reject(err);
                    resolve(true);
                });
            })
        });
    }

    client.playerAddXP = (id, xp, force) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM player WHERE id = '${id}';`, (err, rows) => {
                if(err) reject(err);

                if(rows.length < 1) {
                    let xpToAdd = force && xp || (xp>200) && 200 || xp;
                    client.con.query(`INSERT INTO player(id, xp) VALUES('${id}', ${xpToAdd});`, err => {
                        if(err) reject(err);
                        resolve(true);
                    });
                }else{
                    let playerXP = parseInt(rows[0].xp), playerMaxXP = parseInt(rows[0].xpmax);
                    let xpToAdd;

                    if(force) {
                        xpToAdd = playerXP+xp;
                    }else if(playerXP>=playerMaxXP) {
                        xpToAdd = false;
                    }else if(playerXP+xp>playerMaxXP) {
                        xpToAdd = playerMaxXP;
                    }else xpToAdd = playerXP+xp;

                    console.log(xpToAdd);

                    if(!xpToAdd) return;

                    client.con.query(`UPDATE player SET xp = ${xpToAdd} WHERE id = '${id}';`, err => {
                        if(err) reject(err);
                        resolve(true);
                    });
                }
            });
        });
    }
}