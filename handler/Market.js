module.exports = client => {
	client.marketManagement = class {
		constructor(){
			this.createMarket = (idChannel) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${idChannel}';`, (err, rows) => {
						if(err) resolve();
						if(rows.length == 0){
							const channel = client.channels.cache.find(channel => channel.id === idChannel);
							channel.send(client.sendEmbed('Test Marché', '', 'WHITE'));
							resolve(client.sendEmbed(":white_check_mark: Channel ajouté !", "", "GREEN"));
						}else if (rows.length == 1){
							resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "ORANGe"));
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
