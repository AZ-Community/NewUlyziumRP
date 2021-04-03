const {resolve} = require('path');

module.exports = client => {
	client.loadMarket = () => {
		new Promise((resolve, reject) => {
			client.con.query(`SELECT * FROM marketChannel`, (err, rows) => {
				for(var i = 0; i < rows.length; i++){
					var idChannel = rows[i].idChannel;
					const channel = client.channels.cache.find(channel => channel.id === idChannel);
					const embed = client.sendEmbed("__Marché__", "", "GREEN");
					var textEmbed = JSON.parse(rows[i].itemsMarket);
					if(Object.keys(textEmbed).length <= 0){
						channel.send(client.sendEmbed('Test Marché', `Aucun object à vendre zebi..`, 'WHITE'));
					}else{
						var description = "";
						for(const [key, value] of Object.entries(textEmbed)){
							var price = client.returnCoins(value.price);
							description += ` ${value.emote} - ${client.itemInformation(value.id).name} (Or(s) : ${price[0]})  / Argent(s) ${price[1]}` + 
													` / Cuivre(s) ${price[2]} \n`;
							embed.setDescription(description);
						}
						channel.send(embed).then(message => { message.react("❓"); });
					}
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
							if(channel == undefined) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
							channel.send(client.sendEmbed('Test Marché', this.basicDescription, 'GREEN'));
							client.con.query(`INSERT INTO marketChannel(idChannel, itemsMarket) VALUES('${idChannel}', '{}')`);
							resolve(client.sendEmbed(":white_check_mark: Channel ajouté !", "", "GREEN"));	
						}else if (rows.length == 1){
							resolve(client.sendEmbed(":warning: Channel déjà présent.", "", "RED"));
						}
					});
				});
			}

			this.modifyMarket = (args) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${args[0]}' ;`, (err, rows) => {
						if(err) resolve();
						if(rows.length == 1){
							const channel = client.channels.cache.find(channel => channel.id === args[0]);
							if(!channel) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
							const itemMarket = JSON.parse(rows[0].itemsMarket);
							switch(args[1].toLowerCase()){		
								case "addbuy":
									const typeAndID = args[3].split(";");
									if(client.itemInformation(typeAndID[1])){
										const newItem = client.createItemToBuy(typeAndID[1], 1, args[2]);
										const newJson = new Map();
										console.log(Object.keys(itemMarket).length);
										if(Object.keys(itemMarket).length > 0){
											var size = 1;
											for(const [key, item] of Object.entries(itemMarket)){
												newJson.set(size, item);
												size ++;
											}
											newJson.set(size,newItem);
										}else{
											newJson.set(1,newItem);
										}
										console.log(newJson);
										client.con.query(`UPDATE marketChannel SET itemsMarket='[ ${client.changeMapToJson(newJson)} ]' WHERE idChannel ='${args[0]}'`, 
											(err) => {
											if (err) resolve(client.sendEmbed(":x: __Erreur requête UPDATE dans le Market.js", err, "RED"));
											client.loadMarket();
										});
									}else{
										resolve(client.sendEmbed(":x: __Erreur item non existant", "", "RED"));
									}
									break;
								case "modifbuy":
									for(var [key, value] of itemMarket){
										
									}
									break;
								case "removebuy":
									break;
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
	client.createItemToBuy = (idItem, quantity, prix, emoticon=":question:")  => {
		return {id: idItem, qte: quantity, price: prix, emote: emoticon};
	}
}
