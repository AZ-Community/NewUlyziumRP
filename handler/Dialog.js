module.exports = client => {
    var dialogs_test = require('../json/dialog_pnj/dialog_maire.json')
    client.dialogsPnj = new Map();
    dialogs_test.forEach(dialog =>{
        client.dialogsPnj.set(dialog.progress, dialog)
    });

    /*
     * client.loadProgress ->  load progress of a player
     * @param idPlayer "to found player in database"
     */    
    client.loadProgress = (idPlayer, pnj) => {
        return new Promise((resolve, reject) => {
            client.con.query(`SELECT * FROM progress WHERE idplayer='${idPlayer}' AND pnj='${pnj}'`, (err, rows) => {
                if(err) reject(err);
                if(rows[0]) { resolve(rows[0]); }else{
                    client.saveProgress(idPlayer, 0, 0, pnj);
                    resolve(client.loadProgress(idPlayer))
                }
            });
        });  
    }
    /*
     *  client.saveProgress -> save progress
     *  @param idPlayer "id of player"
     *  @param progressToSave "save the new progress"
     *  @param pnj "id of pnj"
     */
    client.saveProgress = (idPlayer, progressToSave,dialog, pnj) => {
        return new Promise((reject) => {
            client.con.query(`SELECT * FROM progress WHERE idplayer ='${idPlayer}' AND pnj='${pnj}'`, (err, rows) => {
                if(err) reject(err);
                if(rows[0]){
                    client.con.query(`UPDATE progress SET pgrplayers= '${progressToSave}'AND dialog='${dialog}' WHERE idplayer= '${idPlayer}'`, (err) => {
                        if(err) reject(err);
                    });
                }else{
                    client.con.query(`INSERT INTO progress  VALUES ('${idPlayer}', '${progressToSave}','${dialog}', '${pnj}')`, (err) => {
                        if(err) reject(err);
                    });
                }
            });
        });
    } 
}
