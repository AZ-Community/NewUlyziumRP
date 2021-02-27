const Discord = require('discord.js');

module.exports = client => {
	
	client.listChoice = ["📚", '💲', '🏹', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣'];


	/*@param titleEmbed, message, color, urlImage -> String
	 *Return new Embed*/
	client.sendEmbed = (titleEmbed, message, color, urlImage) => {
		const embedGUI = new Discord.MessageEmbed({
			color: color, title: "╭┈┈┈┈┈┈┈‬┈┈┈‬‬┈┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊ "+titleEmbed, 
			description: message, 
			footer: { text:  "[ 💛 ] ΛZUЯΞ | Community ©" }
		});
		if(urlImage) embedGUI.setImage(urlImage);
		return embedGUI;
	}
	
	/* @param message - MessageDiscord | value - List
	 * reactChain for Discord*/

	client.choiceGUI = (message, value = []) => {
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then( async(collected) => {
			const reaction = collected.first();
			for(var index = 0; index < client.listChoice.length; index++){
				if(client.listChoice[index].localeCompare(reaction.emoji.name) == 0){
					message.reactions.removeAll()
					let paramAnswer;
					message.channel.send(client.sendEmbed(value[index][0], value[index][1], value[index][2])); 
					paramAnswer = value[index][4];
					await client.awaitAnswer(message, message.author.id, paramAnswer);			
				}
			}
		}).catch(error => { 
			return message.channel.send(client.sendEmbed("Requête annulé", `${error}`, "RED"));
		});
	}
	
	client.awaitAnswer = (message, author, param) => {
		var filter = m => m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {max: 1, time: 20000,errors: ['time']}).then(async (collected) => {
			const iManage = new client.itemsManagement();
			const lootManager = new client.lootManagement();
			const markManage = new client.marketManagement();
				switch(param){

							/*
							 *Gestion des items;
							 */
					case "addingItem":
						if(collected.last().content.split(' ').length == 1) message.channel.send(await iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase()));
						else message.channel.send(await iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase(), collected.last().content.split(' ')));
						break;
					case "modifingItem":	
						message.channel.send(await iManage.modifingObject(collected.last().content.split(' ')));
						break;
					case "removingItem":
						if(collected.last().content.split(' ').length == 1) message.channel.send(await iManage.removingObject(collected.last().content.split(' ')[0].toUpperCase()));
						else message.channel.send(await iManage.removingObject(collected.last().content.split(' ')[0].toUpperCase(), collected.last().content.split(' ')[1]));
						break;
						/*
						 *Gestion du marché
						 */
					case "addingMarket":
						message.channel.send(await markManage.createMarket(collected.last().content));
						break;
					case "modifingMarket":
						break;
					case "removingMarket":
						break;
						/*
						 *Gestion du Loot
						 */
					case "addingLoot":
						message.channel.send(await lootManager.addingLoot(collected.last().content));
						break;
					case "modifingLoot":
						message.channel.send(await lootManager.modifingLoot(collected.last().content));
						break;
					case "removingLoot":
						break;
				}
		}).catch( (error) => {return message.channel.send(client.sendEmbed("Requête annulé", `Raison: [${error}]`, "RED"))});
	}
}
