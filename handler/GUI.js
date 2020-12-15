const Discord = require('discord.js');

module.exports = client => {
	client.sendEmbed = (titleEmbed, message, color, urlImage) => {
		const embedGUI = new Discord.MessageEmbed({
			color: color, title: "╭┈┈┈┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈┈┈‬┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊ "+titleEmbed, 
			description: message, 
			image:{url: urlImage },
			footer: "[ 💛 ] ULYZIUM RP"
		});
		return embedGUI;
	}
	client.choiceGUI = (message, value = []) => {
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();
				switch(reaction.emoji.name){
					case "2️⃣":
						return message.channel.send(client.sendEmbed(value[1][0],value[1][1], value[1][2], value[1][3].url)); 
						break;
					case "":
						break;
					case "":
						break;
					}
			console.log(reaction);
		}).catch(error => { console.log("[GUI] -------- \n " + error); });
	}
}
