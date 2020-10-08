
module.exports = client => {
    /**
     * client.channelIsXPBan -> Check if channel is XP ban.
     * @require checkChannelIsXPBan function.
     * @param {*} idServer - Server id.
     * @param {*} idChannel - Channel id.
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
     * client.banXPChannel -> Blacklist a channel from XP reward. 
     * @param {*} idServer - Server id.
     * @param {*} idChannel - Channel id.
     * @return false if channel is already ban, true if it has just been banned.
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
     * client.undanXPChannel -> Unblacklist a channel from XP reward.
     * @param {*} idServer - Server id.
     * @param {*} idChannel - Channel id.
     * @return false if channel is not ban, true if it has just been removed.
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

    /**
     * client.playerAddXP -> Add an amount of XP to a player.
     * @param {*} id - Player discord id.
     * @param {*} xp - XP amount to give to the player.
     * @param {*} force - Can amount be over player XP limit ? 
     * @return true if amount has been added, otherwise false.
     */
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

                    if(!xpToAdd) resolve(false);

                    client.con.query(`UPDATE player SET xp = ${xpToAdd} WHERE id = '${id}';`, err => {
                        if(err) reject(err);
                        resolve(true);
                    });
                }
            });
        });
    }

    client.playerRemoveXP = (id, xp) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM player WHERE id = '${id}';`, (err, rows) => {
                if(err) reject(err);

                if(rows.length < 1) {
                    resolve(false);
                }else{
                    let playerXP = parseInt(rows[0].xp);
                    let xpAfterRemove = playerXP - xp;

                    if(xpAfterRemove >= 0) {
                        client.con.query(`UPDATE player SET xp = ${xpAfterRemove} WHERE id = '${id}';`, err => {
                            if(err) reject(err);
                            resolve(true);
                        });
                    }else{
                        let level = parseInt(rows[0].level) - 1;
                        let xpMax = client.xpMaxFromLevel(level);
                        let xpToRemove = xp - playerXP;
                        
                        while(xpToRemove > xpMax){
                            level--;
                            xpToRemove = xpToRemove - xpMax;
                            xpMax = client.xpMaxFromLevel(level);
                        }

                        xpAfterRemove = xpMax - xpToRemove;

                        client.con.query(`UPDATE player SET xp = ${xpAfterRemove}, level = ${level} WHERE id = '${id}';`, err => {
                            if(err) reject(err);
                            resolve(true);
                        });
                    }
                }
            });
        });
    }

    client.xpMaxFromLevel = level => {
        let minXP = Math.pow(level, 2)*200*0.5 + level*200 + 200;
        return minXP;
    }

    client.playerLevelUp = (id, lvlToAdd) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM player WHERE id = '${id}';`, (err, rows) => {
                if(err) reject(err);
                
                if(rows.length < 1){
                    resolve(false);
                }else{
                    client.con.query(`UPDATE player SET level = ${parseInt(rows[0].level) + lvlToAdd} WHERE id = '${id}';`, err => {
                        if(err) reject(err);
                        resolve(true);
                    })
                }
            });
        });
    }
}