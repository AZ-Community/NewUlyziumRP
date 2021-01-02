const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if(!client.userIsStaff(message.guild, message.author)) {
       return message.channel.send({embed:
			{color: "RED", description: `:x: <@${message.author.id}>, cette commande est réservée aux membres du staff.`}});
    }
	if(args[0] == null) return message.channel.send(exports.help.example)
	if(client.users.cache.get(args[0])){ 
		return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Il ne s'agit pas d'une mention!`}});
	}
	var member = message.guild.members.cache.get(message.mentions.users.first().id);
	message.react("❌");
	message.react("✅");
	message.awaitReactions(client.filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
		const iManage = new client.itemsManagement();
		const reaction = collected.first();
		if (reaction.emoji.name === '✅') {
			iManage.resetInventory(member.user.id);
			return message.channel.send({embed: {color: "GREEN", description: `:white_check_mark: <@${message.author.id}>,` +
			`L'inventaire est réinitiliasé.`}});	
		} else {
			 return message.channel.send({embed: {color: "RED", description: `:x: <@${message.author.id}>, Vous avez`+ 
				` annulé la reuqête.`}});
		}
	});
}

exports.help = {
    name: "reset-inv",
    description: "Permet de réinitialiser l'inventaire d'un joueur",
    usage: "=reset-inv",
    example: "=reset-inv <joueur mention>"
}

exports.conf = {
    aliases: ["rst-inv", "reset-invnetory"]
}
