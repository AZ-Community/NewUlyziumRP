const {resolve} = require('path');

module.exports = client => {

	/*
	 * @type void
	 * Send embeds on markets channel
	 */
	client.loadMarket = () => {
			const embed = client.sendEmbed("__Marché__", "", "GREEN");
			client.con.query(`SELECT * FROM marketChannel`, (err, rows) => {
				for(var i = 0; i < rows.length; i++){
					var idChannel = rows[i].idChannel;
					const channel = client.channels.cache.find(channel => channel.id === idChannel);
					var textEmbed = JSON.parse(rows[i].itemsMarket);
					if(Object.keys(textEmbed).length <= 0){
						channel.send(client.sendEmbed('Marché', client.markManage.basicDescription, 'WHITE'));
					}else{
						var description = "";
						for(const [key, value] of Object.entries(textEmbed)){
							var price = client.returnCoins(value.price);
							description += ` ${value.emote} - ${client.itemInformation(value.id).name} (Or(s) : ${price[0]})  / Argent(s) ${price[1]}` + 
													` / Cuivre(s) ${price[2]} \n`;
							embed.setDescription(description);
						}
						channel.bulkDelete(50, true);
						channel.send(embed).then(message => { 
							for (const [key, value] of Object.entries(textEmbed));
								//message.react(value.emote);	
						});
					}
					resolve();
				}
			});
	}
	client.marketManagement = class {
		constructor(){
			this.basicDescription = "Aucun objet est à vendre... Les marchands dorment ! :zzz:";

			/*
			 * @param args = List
			 * <ID Channel> <addbuy|modifbuy|rembuy> <item id>
			 *  <addbuy> <price> TYPE;ITEMID
			 *  <modifBuy> <setqte;setemote;setprice> <...>
			 *  <remBuy> <itemMarket ID>
			 */
			this.modifyMarket = (args) => {
				return new Promise((resolve, reject) => {
					client.con.query(`SELECT * FROM marketChannel WHERE idChannel = '${args[0]}' ;`, (err, rows) => {
						console.log(args[0]);
						if(err) resolve();
						console.log(rows);
						if(rows.length == 1){
							const channel = client.getChannel(args[0]);
							if(!channel) resolve(client.sendEmbed(":x: __Erreur__","Channel innexistant / Mauvais id !", "RED"));
							const itemMarket = JSON.parse(rows[0].itemsMarket);
							const newJson = new Map();
							switch(args[1].toLowerCase()){		
								case "addbuy":
									const typeAndID = args[3].split(";");
									if(client.itemInformation(typeAndID[1])){
										const newItem = client.createItemToBuy(typeAndID[1], 1, args[2]);
										console.log(Object.keys(itemMarket).length);
										if(Object.keys(itemMarket).length > 0){
											var size = 1;
											for(const [key, item] of Object.entries(itemMarket)){
												newJson.set(size, item);
												size++;
											}
											newJson.set(size,newItem);
										}else{
											newJson.set(1,newItem);
										}
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
									for(var [key, value] of Object.entries(itemMarket)){
										if(args[2] == key){
											if(args[3]){
												console.log(args[3]);
												switch(args[3].toLowerCase()){
													case "setprice":
														value.price = parseInt(args[4]);
														break;
													case "setqte":
														value.qte = parseInt(args[4]);
														break;
													case "setemote":
														value.emote = args[4];							
														break;
												}
											}else resolve(client.sendEmbed(
												":x: __Mauvaise configuration__!",
												"",
												"RED"
											));
										}
										newJson.set(key, value);
									}
									client.con.query(`UPDATE marketChannel SET itemsMarket='[ ${client.changeMapToJson(newJson)} ]' WHERE idChannel ='${args[0]}'`,  (err) => {
										console.log(err);
										if (err) resolve(client.sendEmbed(":x: __Erreur requête UPDATE dans le Market.js", err, "RED"));
										client.loadMarket();
									});
									break;
								case "removebuy":
									for(var [key, value] of Object.entries(itemMarket)){
										if(args[2] != key)
											newJson.set(key, value);
									}
									client.con.query(`UPDATE marketChannel SET itemsMarket='[ ${client.changeMapToJson(newJson)} ]' WHERE idChannel ='${args[0]}'`,  (err) => {
										console.log(err);
										if (err) resolve(client.sendEmbed(":x: __Erreur requête UPDATE dans le Market.js", err, "RED"));
										client.loadMarket();
									});
									break;			
							}
						}else if (!rows.length){
							resolve(client.sendEmbed(":warning: Channel innexistant", "", "RED"));
						}
					});
				});
			}	
		}
	}
	client.markManage = new client.marketManagement();
	/*
	 * @param idItem = String
	 * @param quantity = int;
	 * @param prix = int;
	 * @param emoticon = String (utf-_ to utf-32);
	 */
	client.createItemToBuy = (idItem, quantity, prix, emoticon="❓")  => {
		return {id: idItem, qte: quantity, price: prix, emote: emoticon};
	}
}
