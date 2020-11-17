const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }
	if(args[0] == null || args[1] == null) return message.channel.send(exports.help.example)
	if(client.users.cache.get(args[0])) return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Il ne s'agit pas d'une mention!`}});
	if(client.itemInformation(args[1], "id")){
        message.react("❌");
        message.react("✅")
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();
			if (reaction.emoji.name === '✅') {
				client.giveToPlayerItem(message.author.id, args[1],  (args[2] || 1));
		        return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}>, L'item **${client.itemInformation(args[1], "name")}**  a bien été envoyé à l'utilisateur!`}});
			} else {
				 return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Vous avez annulé la reuqête.`}});
			}
		}).catch(collected => {
			message.reply("Vous n'avez pas réagis donc la requête s'annule.");
		});
	
	}else return message.channel.send({embed: {color:"RED", description: `:x: <@${message.author.id}>, il s'agit d'un mauvais id pour cet item !`}}) 
}

exports.help = {
    name: "add-inv",
    description: "Permet de give des items",
    usage: "=add-inv",
    example: "=add-inv <joueur mention> <id de l'item> [quantité]"
}

exports.conf = {
    aliases: ["add-inventory"]
}
