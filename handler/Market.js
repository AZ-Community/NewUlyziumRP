const {resolve} = require('path');

module.exports = client => {
	client.loadMarket = () => {
		return new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM marketChannel`, (err, rows) => {
				for(var i = 0; i < rows.length; i++){
					var idChannel = rows[i].idChannel;
					const channel = client.channels.cache.find(channel => channel.id === idChannel);
					var textEmbed = JSON.parse(rows[i].itemsMarket);
					if(Object.keys(textEmbed).length == 0) channel.send(client.sendEmbed('Test Marché', `Aucun object à vendre zebi..`, 'WHITE'));
					resolve();
				}
			});
		});
	}
	
	client.marketManagement = class {
		constructor(){
			this.basicDescription = "Aucun objet est à vendre... Les marchands dorment ! :zzz:";
			this.createMarket = (idChannel, itemId) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
						if(err) resolve();
						if(rows.length == 0){
							if(!itemId){
								const channel = client.channels.cache.find(channel => channel.id === idChannel);
								if(channel == undefined) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
								channel.send(client.sendEmbed('Test Marché', this.basicDescription, 'GREEN'));
								client.con.query(`INSERT INTO marketChannel(idChannel, itemsMarket) VALUES('${idChannel}', '{}')`);
								resolve(client.sendEmbed(":white_check_mark: Channel ajouté !", "", "GREEN"));
							}else{
								
							}
						}else if (rows.length == 1){
							resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "RED"));
						}
					});
				});
			}
			this.modifyMarket = (idChannel, achat) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
						if(err) resolve();
						if(rows.length == 1){
							const channel = client.channels.cache.find(channel => channel.id === idChannel);
							if(channel == undefined) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
							const itemMarket = JSON.parse(rows[0].itemsMarket);
							for(var [key, value] of itemMarket){

							}

						}else if (rows.length == 0){
							resolve(client.sendEmbed(":warning: Channel innexistant", "", "RED"));
						}
					});
				});
			}
			this.removeMarket = () => {
	
			}
		}
	}
	this.createItemToBuy = (idItem, quantity, prix)  => {
		return {id: idItem, qte: quantity, price: prix};
	}
}
