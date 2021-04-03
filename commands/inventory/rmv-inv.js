const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
        return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }
	const iManage = new client.itemsManagement();	
	if(args[0] == null || args[1] == null) return message.channel.send(exports.help.example)
	if(client.users.cache.get(args[0])) return message.channel.send({embed: 
			{color: "RED", description: `:x: <@${message.author.id}>, Il ne s'agit pas d'une mention!`}});
	var member = message.guild.members.cache.get(message.mentions.users.first().id); 
	if(client.itemInformation(args[1])){
    message.react("❌");
    message.react("✅")
		message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
			const reaction = collected.first();
			if (reaction.emoji.name === '✅') {
				var quantity = (args[2]) ?  parseInt(args[2]) : -1;
				console.log(- Math.abs(quantity));
				iManage.giveToPlayerItem(member.user.id, args[1], -Math.abs(quantity));
		    	return message.channel.send({embed: 
						{color: "GREEN", 
						description: `:white_check_mark: <@${message.author.id}>, L'item **${client.itemInformation(args[1]).name}**  L'item a été retiré!`}});
			} else {
				 return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Vous avez annulé la requête.`}});
			}
		}).catch(collected => {
			console.log(collected);
			message.reply("Vous n'avez pas réagis donc la requête s'annule.");
		});
	
	}else return message.channel.send({embed: {color:"RED", description: `:x: <@${message.author.id}>, il s'agit d'un mauvais id pour cet item !`}}) 
}

exports.help = {
    name: "rmv-inv",
    description: "Permet de retirer des items",
    usage: "=rmv-inv",
    example: "=rmv-inv <joueur mention> <id de l'item> [quantité]"
}

exports.conf = {
    aliases: ["rmv-inv", "rmv-items"]
}
