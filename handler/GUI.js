const Discord = require('discord.js');

module.exports = client => {
	
	client.listChoice = ["📚", '💲', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣'];


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
					if(value.length > 1){ message.channel.send(client.sendEmbed(value[index][0], value[index][1], value[index][2])); paramAnswer = value[index][4]; }
					else{ message.channel.send(client.sendEmbed(value[0][0], value[0][1], value[0][2])); paramAnswer = value[0][4];}
					await client.awaitAnswer(message, message.author.id, paramAnswer);			
				}
			}
		}).catch(error => { return message.channel.send(client.sendEmbed("Requête annulé", `${error}`, "RED"))});
	}
	
	client.awaitAnswer = (message, author, param) => {
		var filter = m => m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {max: 1, time: 20000,errors: ['time']}).then(async (collected) => {
			const iManage = new client.itemsManagement();
				switch(param){
					case "addingItem":
						if(collected.last().content.split(' ').length == 1) message.channel.send(await iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase()));
						else message.channel.send(await iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase(), collected.last().content.split(' ')));
						break;
					case "modifingItem":	
						message.channel.send(await iManage.modifingObject(collected.last().content.split(' ')));
						break;
					case "removingItem":
						break;
				}
		}).catch( (error) => {return message.channel.send(client.sendEmbed("Requête annulé", `Raison: [${error}]`, "RED"))});
	}
}
