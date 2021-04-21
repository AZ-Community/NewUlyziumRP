const Discord = require('discord.js');
const Canvas = require("canvas");

module.exports = client => {
	/*@param titleEmbed, message, color, urlImage -> String
	 *Return new Embed*/
	client.sendEmbed = (titleEmbed, message, color, urlImage) => {
		const embedGUI = new Discord.MessageEmbed({
			color: color, 
			title: "╭┈┈┈┈┈┈┈‬┈┈┈‬‬┈┈┈‬┈┈‬\n┊ ✧ ೃ༄ ┊ "+ titleEmbed, 
			description: message, 
			footer: { text:  "[ 💛 ] ΛZUЯΞ | Community ©" }
		});
		if(urlImage) embedGUI.setImage(urlImage);
		return embedGUI;
	}
	client.canvas = Canvas;
	client.canvas.registerFont('./fonts/PixAntiqua.ttf', { family: 'PixAntiqua' })
	client.applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');
		let fontSize = 70;
		do {
			ctx.font = `${fontSize -= 10}px "PixAntiqua"`;
		} while ( ctx.measureText(text).width > 150 );
		return ctx.font;
	};
	client.expBar = () => {
		const canvas = client.canvas.createCanvas(200, 90);
		const ctx = canvas.getContext('2d');
	}

	/* @param message - MessageDiscord | value - List
	 * reactChain for Discord*/
	client.choiceGUI = (message, value = [], listChoice = ['📚', '💲', '🏹', '👽'] ) => {
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then( async(collected) => {
			const reaction = collected.first();
			for(var index = 0; index < listChoice.length; index++){
				if(reaction.emoji.name == "❌") return message.channel.send(client.sendEmbed("Requête annulé", "", ""));
				if(listChoice[index].localeCompare(reaction.emoji.name) == 0){
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
	};

	/*@param titleEmbed, message, color, urlImage -> String
	 *Return new Embed*/
	client.classicalEmbed = (titleEmbed, message, color, urlImage) => {
			const embedGUI = new Discord.MessageEmbed({
			color: color, 
			title: titleEmbed, 
			description: message, 
			footer: { text:  "[ 💛 ] ΛZUЯΞ | Community ©" }
		});
		if(urlImage) embedGUI.setImage(urlImage);
		return embedGUI;
	};
	
	client.awaitAnswer = (message, author, param) => {
		var filter = m => m.author.id == message.author.id;
		message.channel.awaitMessages(filter, {max: 1, time: 20000,errors: ['time']}).then(async (collected) => {
		switch(param){
			/*
			 *Gestion des items;
			 */
			case "addingItem":
				if(collected.last().content.split(' ').length == 1) message.channel.send(await client.iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase()));
				else message.channel.send(await client.iManage.addingObject(collected.last().content.split(' ')[0].toUpperCase(), collected.last().content.split(' ')));
				break;
			case "modifingItem":	
				message.channel.send(await client.iManage.modifingObject(collected.last().content.split(' ')));
				break;
			case "removingItem":
				if(collected.last().content.split(' ').length == 1) message.channel.send(await client.iManage.removingObject(collected.last().content.split(' ')[0].toUpperCase()));
				else message.channel.send(await client.iManage.removingObject(collected.last().content.split(' ')[0].toUpperCase(), collected.last().content.split(' ')[1]));
				break;
			/*
			 *Gestion du marché
			 */
			case "addingMarket":
				message.channel.send(await client.createMarket(collected.last().content));
				break;
			case "modifingMarket":
				message.channel.send(await client.markManage.modifyMarket(collected.last().content.split(' ')));
				break;
			case "removingMarket":
				message.channel.send(await client.removeMarket(collected.last().content.split(' ')[0]));
				break;
			/*
			 *Gestion des Monstres
			 */
			case "addingMonster":
				message.channel.send(await client.monsterManager.addMonster(collected.last().content));
				break;
			case "addingMonsterSP":
				message.channel.send(await client.addMonsterSpawnPoint(collected.last().content.split(' ')[0]));
				break;
			case "removingMonsterSP":
				message.channel.send(await client.addMonsterSpawnPoint(collected.last().content.split(' ')[0]));
				break;
		}
		}).catch( (error) => {
			console.log(error);
			return message.channel.send(client.sendEmbed("Requête annulé", `Raison: [${error}]`, "RED"))});
	}
}
