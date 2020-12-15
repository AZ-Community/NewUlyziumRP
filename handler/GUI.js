const Discord = require('discord.js');

module.exports = client => {
	
	client.listChoice = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '0️⃣'];

	/*@param titleEmbed, message, color, urlImage -> String
	 *Return new Embed*/
	client.sendEmbed = (titleEmbed, message, color, urlImage) => {
		const embedGUI = new Discord.MessageEmbed({
			color: color, title: "╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊ "+titleEmbed, 
			description: message, 
			footer: { text:  "[ 💛 ] ΛZUЯΞ | Community ©" }
		});
		if(urlImage) embedGUI.setImage(urlImage);
		return embedGUI;
	}
	
	/* @param message - MessageDiscord | value - List
	 * reactChain for Discord*/

	client.choiceGUI = (message, value = []) => {
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();
			for(var index = 0; index < client.listChoice.length; index++){
				if(client.listChoice[index].localeCompare(reaction.emoji.name) == 0){
					message.channel.bulkDelete(1);
					message.reactions.removeAll()
					message.channel.send(client.sendEmbed(value[index][0], value[index][1], value[index][2]));
					client.awaitAnswer(message);					
				}
			}
		}).catch(error => { console.log("[GUI] -------- \t " + error); });
	}
	
	client.awaitAnswer = (message) => {
		message.channel.awaitMessages(response => message.content, {max: 2, time: 20000,errors: ['time'],}).then((collection) => {
			client.con.query(`INSERT INTO itemLists(type, items) VALUES('${collection.last().content.toUpperCase()}', '{}')`, (err) => {
				if(err) return err;
				return message.channel.send(client.sendEmbed(`Le type ${collection.last().content.toUpperCase()}  est crée`, "", "GREEN"));
			});
		}).catch( error => {console.log("[GUi -await] " +error);});
	}
}
