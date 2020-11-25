const Discord = require('discord.js');

exports.run = async (client, message, args) => {
	var item;
	var inventoryEmbed = new Discord.MessageEmbed()
		.setTitle("`S a c | 🏵️ `")
		.setThumbnail('https://media.discordapp.net/attachments/743582758554566659/763443002080624680/hira-bilal-bag-removebg-preview.png')
		.setColor('GREEN')
	if(args[0]){ //Si une mention est faite
		var member = message.guild.members.cache.get(message.mentions.users.first().id); 
		if(client.userIsStaff(message.guild, message.author)){ //Si c'est un membre du staff
			if(member != null){ //On vérifié que le joueur existe
				item = await client.returnInventory(member.user.id);
				if(typeof item != "string"){	
					inventoryEmbed.addField("╺─────み─────╸", `Inventaire de: ${member.user.username}`);
					for(const[name,quantity] of item){
						inventoryEmbed.addField(`${name} - ${quantity}`, "Effet:..");
					}
				}else{
					inventoryEmbed.addField("╺─────み─────╸", item);
				}
			}else{//Si le joueur est undefined:
				return message.channel.send({embed: {color:"RED", description: `:x: <@${message.author.id}>, il s'agit d'une mauvaise mention !`}}); 
			}
		}else{//Si ce n'est pas un membre du staff
			 return message.channel.send({embed: {color:"RED", description: `:x: <@${message.author.id}>, Vous n'êtes pas un membre du staff!`}}); 
		}
	}else{ //Sinon on retourne son inventaire
		item = await client.returnInventory(message.author.id);
		if(typeof item != "string"){	
			inventoryEmbed.addField("╺─────み─────╸", `Votre inventaire`);
			for(const[name,quantity] of item){
				inventoryEmbed.addField(`${name}*${quantity}`, "Effet:..");
			}
		}else{
			inventoryEmbed.addField("╺─────み─────╸", item);
		}
	}	
	inventoryEmbed.addField("╺─────み─────╸" ,"_**Z i u m's :gem:**_\n [ 88 ] \n**_P i è c e s :moneybag:_** \n`Or` 100\n`Argent` 53\n`Cuivre` 85")
	return message.channel.send(inventoryEmbed);
}

exports.help = {
    name: "inv",
    description: "Visualiser son inventaire",
    usage: "=inv",
    example: "=inv"
}

exports.conf = {
    aliases: ["inventory"]
}
