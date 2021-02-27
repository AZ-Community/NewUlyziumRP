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
			this.createMarket = (idChannel) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
						if(err) resolve();
						if(rows.length == 0){
							const channel = client.channels.cache.find(channel => channel.id === idChannel);
							channel.send(client.sendEmbed('Test Marché', this.basicDescription, 'WHITE'));
							client.con.query(`INSERT INTO marketChannel(idChannel, itemsMarket) VALUES('${idChannel}', '{}')`);
								resolve(client.sendEmbed(":white_check_mark: Channel ajouté !", "", "GREEN"));
						}else if (rows.length == 1){
							resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "ORANGE"));
						}
					});
				});
			}
			this.modifyMarket = (idChannel, achat) => {
			
			}
			this.removeMarket = () => {
	
			}
		}
	}
}
