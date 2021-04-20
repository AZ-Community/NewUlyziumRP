module.exports = client => {
	/*
	* @param idChannel = String
	* Register channel like a Monster Spawn point
	*/
	client.addMonsterSpawnPoint = (idChannel) => {
		return new Promise((resolve, reject) 	=> {
			client.con.query(`SELECT * FROM monsterChannel WHERE idChannel =${idChannel}`, (err, rows) => {
				if (rows.length == 1 )  resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "RED"));
				const channel = client.getChannel(idChannel);
				if(channel == undefined) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
				client.con.query(`INSERT INTO monsterChannel(idChannel, monsters) VALUES ('${idChannel}', '{}');`, (err) => {		
					if(err) resolve(client.sendEmbed(
						"ERREUR",
						"Handler/Monster.js => Une erreur dans le INSERT INTO " + err,
						"RED"
					));
					resolve(client.sendEmbed(		
						":white_check_mark: Channel ajouté !",
						"Il y'aura bien un spawnpoint ici",
					"GREEN"));
				});
			});
		});
	}
	/*
	* @param idChannel = String
	* Remove Markets with items...
	*/
	client.removeMarket = (idChannel) => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
			if(err) resolve();
			if(rows.length == 1){
				client.con.query(`DELETE FROM marketChannel WHERE idChannel ='${rows[0].idChannel}'`);
				resolve(client.sendEmbed(":white_check_mark: Channel supprimé !", "", "GREEN"));	
			}else if (rows.length == 0){
				resolve(client.sendEmbed(":warning: Channel innexistant.", "", "RED"));
				}
			});
		});
	}
	/*
	* @param idChannel = String
	* Register channel like a Markets
	*/
	client.createMarket = (idChannel) => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
			if(err) resolve();
			if(rows.length == 0){	
				const channel = client.getChannel(idChannel);
				if(channel == undefined) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
					channel.send(client.sendEmbed('Test Marché', client.markManage.basicDescription, 'GREEN'));
					client.con.query(`INSERT INTO marketChannel(idChannel, itemsMarket) VALUES('${idChannel}', '{}')`);
					resolve(client.sendEmbed(":white_check_mark: Channel ajouté !", "", "GREEN"));	
			 }else if (rows.length == 1){
					resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "RED"));
				}
			});
		});
	}
	client.getChannel = (idChannel) => {
		return client.channels.cache.find(channel => channel.id === idChannel);
	}
}
